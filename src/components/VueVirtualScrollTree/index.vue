<template>
  <div ref="treeView" class="vue-virtual-scroll-tree" :style="{ height: `${option.height}px` }" @scroll="handleScroll">
    <!-- Base -->
    <div class="vue-virtual-scroll-tree__base" :style="{ height: baseHeight }" />

    <!-- Empty Block -->
    <div v-if="listData.length === 0" class="vue-virtual-scroll-tree__empty-block">
      <span class="empty-text">{{ emptyText }}</span>
    </div>

    <!-- Tree List -->
    <div v-else class="vue-virtual-scroll-tree__list" :style="{ transform: `translateY(${offset}px)` }">
      <!-- Tree Item -->
      <div
        v-for="(item, index) in listData"
        :key="item.id"
        :class="{' vue-virtual-scroll-tree__item': true, selected: highlightCurrent && item.id === current, disabled: item.disabled }"
        :style="{
          height: `${option.itemHeight}px`
        }"
      >

        <!-- Indent -->
        <span class="vue-virtual-scroll-tree__indent">
          <span v-for="(indent, key) in item.indents" :key="key" :class="{ 'indent-unit': true, line: showLine && indent }" />
        </span>

        <!-- Expand -->
        <svg-icon
          v-if="item.children && item.children.length"
          icon="right-arrow"
          :class="{
            'vue-virtual-scroll-tree__expand': true,
            expanded: item.expand
          }"
          @click="toggleExpand(item)"
        />

        <!-- Switcher -->
        <span v-else-if="showLine" class="vue-virtual-scroll-tree__switcher">
          <span :class="{ 'switcher-leaf-line': true, last: item.last }" />
        </span>

        <!-- Content -->
        <span class="vue-virtual-scroll-tree__content" @click="handleClick(item)">
          <template v-if="showIcon">
            <template v-if="item.children && item.children.length">
              <svg-icon v-if="item.expand" icon="folder-open" class="vue-virtual-scroll-tree__icon" />
              <svg-icon v-else icon="folder" class="vue-virtual-scroll-tree__icon" />
            </template>

            <svg-icon v-else icon="file" class="vue-virtual-scroll-tree__icon" />
          </template>

          <slot :item="item" :index="index" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import SvgIcon from '@/components/SvgIcon'

let lastTime = 0

export default {
  name: 'VueVirtualScrollTree',
  components: {
    SvgIcon
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    showLine: {
      type: Boolean,
      default: true
    },
    highlightCurrent: {
      type: Boolean,
      default: true
    },
    emptyText: {
      type: String,
      default: 'No Data'
    },
    filterNodeMethod: {
      type: Function,
      default: null
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    timeout: {
      type: Number,
      default: 17
    },
    option: {
      type: Object,
      default: () => ({
        height: 500,
        itemHeight: 24
      })
    }
  },
  data () {
    return {
      current: null,
      offset: 0,
      baseHeight: '0px',
      listData: []
    }
  },
  computed: {
    flattenTree () {
      const flatten = (treeData, level = 1, parent = null) => treeData.reduce(
        (acc, v) => {
          if (!v.id) {
            v.id = uuidv4()
          }

          v.level = level
          v.parent = parent

          v.indents = []
          for (let i = 0; i < v.level - 1; i++) {
            v.indents[i] = false
          }

          if (v.disabled === undefined) {
            v.disabled = false
          }

          if (v.locked === undefined) {
            v.locked = false
          }

          if (v.expand === undefined) {
            v.expand = this.defaultExpandAll
          }

          if (v.visible === undefined) {
            v.visible = true
          }

          if (!parent.visible || !parent.expand) {
            v.visible = false
          }

          acc.push(v)
          if (v.children) {
            acc.push(...flatten(v.children, level + 1, v))
          }

          return acc
        }, [])

      return flatten(this.data, 1, {
        id: uuidv4(),
        level: 0,
        visible: true,
        expand: true,
        children: this.data
      })
    },

    visibleListCount () {
      return Math.floor(this.option.height / this.option.itemHeight)
    }
  },
  watch: {
    data (v) {
      console.log(v)
      this.updateTreeView()
    }
  },
  mounted () {
    this.updateTreeView()
  },
  methods: {
    handleClick (item) {
      this.toggleExpand(item)

      if (!item.disabled) {
        this.current = item.id

        this.$emit('node-click', item)
      }
    },

    clear () {
      this.current = null
    },

    filter (value) {
      if (!this.filterNodeMethod) throw new Error('[VueVirtualScrollTree] filterNodeMethod is required when filter')

      const filterVisible = item => {
        item.visible = true
        item.expand = true
        item.locked = false
        if (item.parent) {
          filterVisible(item.parent)
        }
      }

      this.flattenTree.forEach(item => {
        if (this.filterNodeMethod(value, item)) {
          filterVisible(item)
        } else {
          item.visible = false
          item.locked = true
        }
      })

      this.updateTreeView()
    },

    updateTreeView () {
      const visibleCount = this.flattenTree.filter(item => item.visible).length
      this.baseHeight = visibleCount * this.option.itemHeight + 'px'
      // this.$emit('update', this.data)
      this.handleScroll()
    },

    handleScroll () {
      const currentTime = +new Date()
      if (currentTime - lastTime > this.timeout) {
        this.updateList(this.$refs.treeView.scrollTop)
        lastTime = currentTime
      }
    },

    updateList (scrollTop = 0) {
      let start = Math.floor(scrollTop / this.option.itemHeight) - Math.floor(this.visibleListCount / 2)
      start = start < 0 ? 0 : start
      const end = start + this.visibleListCount * 2

      const visibleData = this.flattenTree.filter(v => v.visible)

      if (this.showLine) {
        const siblingMap = new Map()
        const indexMap = new Map()
        visibleData.forEach(v => {
          const siblingCount = siblingMap.get(v.parent.id)
          if (siblingCount === undefined) {
            siblingMap.set(v.parent.id, 1)
          } else {
            siblingMap.set(v.parent.id, siblingCount + 1)
          }

          indexMap.set(v.parent.id, 0)
        })

        const indentMap = new Map()
        visibleData.forEach(v => {
          const siblingCount = siblingMap.get(v.parent.id)
          const selfIndex = indexMap.get(v.parent.id)
          if (selfIndex === siblingCount - 1) {
            v.last = true
            indentMap.set(v.level - 1, false)
          } else {
            v.last = false
            indentMap.set(v.level - 1, true)
          }

          indexMap.set(v.parent.id, selfIndex + 1)

          for (let i = 0; i < v.level - 1; i++) {
            v.indents[i] = indentMap.get(i)
          }
        })
      }

      this.listData = visibleData.slice(start, end)

      this.offset = start * this.option.itemHeight
    },

    toggleExpand (item) {
      if (item.expand) {
        this.collapse(item, true)
      } else {
        this.expand(item, true)
      }

      this.updateTreeView()
    },

    expand (item) {
      item.expand = true
      this.updateExpand(item.children, true)
    },

    collapse (item) {
      item.expand = false
      this.updateExpand(item.children, false)
    },

    updateExpand (children, visible) {
      children && children.forEach(node => {
        if (!node.locked) {
          node.visible = visible
          if (node.children && node.expand) {
            this.updateExpand(node.children, visible)
          }
        }
      })
    },

    expandAll () {
      this.flattenTree.forEach(item => {
        if (!item.locked) {
          item.expand = true
          item.visible = true
        }
      })

      this.updateTreeView()
    },

    collapseAll (level = 1) {
      this.flattenTree.forEach(item => {
        item.expand = false
        if (item.level !== level) {
          item.visible = false
        }
      })

      this.updateTreeView()
    }
  }
}
</script>

<style scoped lang="scss">
.vue-virtual-scroll-tree {
  position: relative;
  overflow: auto;

  &__base {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }

  &__empty-block {
    position: relative;
    min-height: 100px;
    text-align: center;
    width: 100%;
    height: 100%;

    .empty-text {
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      color: #909399;
      font-size: 14px;
    }
  }

  &__list {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    min-height: 100px;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    outline: none;

    &:hover {
      background-color: #f5f7fa;
    }

    &:focus {
      background-color: #f5f7fa;
    }

    &.selected {
      background-color: #f0f7ff;
    }

    &.disabled {
      .vue-virtual-scroll-tree__content {
        color: rgba(0, 0, 0, 0.25);
        cursor: not-allowed;
      }
    }
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    z-index: auto;
    min-height: 24px;
    margin: 0;
    padding: 0 4px;
    line-height: 24px;
    background: transparent;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
  }

  &__expand {
    padding: 6px;
    cursor: pointer;
    color: #c0c4cc;
    font-size: 12px;
    transform: rotate(0deg);
    /* transition: transform .3s ease-in-out; */

    &.expanded {
      transform: rotate(90deg);
    }
  }

  &__icon {
    margin-right: 8px;
  }

  &__indent {
    align-self: stretch;
    white-space: nowrap;
    user-select: none;

    .indent-unit {
      display: inline-block;
      width: 24px;
      position: relative;
      height: 100%;

      &.line {
        &::before {
          position: absolute;
          top: 0;
          right: 11px;
          bottom: 0;
          border-right: 1px solid #d9d9d9;
          content: "";
        }
      }
    }
  }

  &__switcher {
    position: relative;
    flex: none;
    align-self: stretch;
    width: 24px;
    margin: 0;
    line-height: 24px;
    text-align: center;
    user-select: none;

    .switcher-leaf-line {
      position: relative;
      z-index: 1;
      display: inline-block;
      width: 100%;
      height: 100%;

      &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        margin-left: 0;
        border-left: 1px solid #d9d9d9;
        content: " ";
      }

      &::after {
        position: absolute;
        width: 10px;
        height: 12px;
        margin-left: 0;
        border-bottom: 1px solid #d9d9d9;
        content: " ";
      }

      &.last {
        &::before {
          top: auto!important;
          bottom: auto!important;
          height: 12px!important;
        }
      }
    }
  }
}
</style>
