# Vue Virtual Scroll Tree

```Vue 3 + Virtual Scroll + Tree```

## Install

```shell
npm install --save vue-virtual-scroll-tree
```

## Quick Start

``` javascript
import Vue from 'vue'
import VueVirtualScrollTree from 'vue-virtual-scroll-tree'

Vue.use(VueVirtualScrollTree)

// or
import { VueVirtualScrollTree } from 'vue-virtual-scroll-tree'

Vue.component(VueVirtualScrollTree.name, VueVirtualScrollTree)
```

## Basic Usage

```html
<template>
  <VueVirtualScrollTree :data="treeData">
    <template v-slot="{ item }">
      <span>{{ item.label }}</span>
    </template>
  </VueVirtualScrollTree>
</template>

<script>
export default {
  data () {
    return {
      treeData: [
        {
          label: 'Level one 1',
          children: [
            {
              label: 'Level two 1-1',
              children: [
                {
                  label: 'Level three 1-1-1'
                }
              ]
            },
            {
              label: 'Level two 1-2'
            }
          ]
        },
        {
          label: 'Level one 2'
        }
      ]
    }
  }
}
</script>
```

## Build

```shell
npm run build
```

## Attributes

| Attribute          | Description                                                                                                    | Type                  | Default |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | --------------------- | ------- |
| data               | tree data                                                                                                      | array                 | []      |
| empty-text         | text displayed when data is void                                                                               | string                | No Data |
| highlight-current  | whether current node is highlighted                                                                            | boolean               | true    |
| default-expand-all | whether to expand all nodes by default                                                                         | boolean               | true    |
| showIcon           | shows the icon before a node's label.                                                                          | boolean               | true    |
| showLine           | shows a connecting line                                                                                        | boolean               | true    |
| filter-node-method | this function will be executed on each node when use filter method. if return false, tree node will be hidden. | Function(value, data) | —       |
| timeout            | refresh timeout                                                                                                | number                | 17      |
| option             | configuration options, see the following table                                                                 | object                | —       |

## Option

| Attribute  | Description                   | Type   | Default |
| ---------- | ----------------------------- | ------ | ------- |
| height     | config virtual scroll height. | number | 500     |
| itemHeight | config node's height.         | number | 24      |

## Node props

| Attribute | Description       | Type    |
| --------- | ----------------- | ------- |
| label     | node's label      | string  |
| children  | node's subtree    | string  |
| disabled  | disables the node | boolean |

## Method

| Method | Description                                          | Parameters                                                                      |
| ------ | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| filter | filter all tree nodes, filtered nodes will be hidden | Accept a parameter which will be used as first parameter for filter-node-method |

## Events

| Event Name | Description                     | Parameters                                    |
| ---------- | ------------------------------- | --------------------------------------------- |
| node-click | triggers when a node is clicked | node object corresponding to the node clicked |

## Scoped Slot

| Name | Description                                                    |
| ---- | -------------------------------------------------------------- |
| —    | Custom content for tree nodes. The scope parameter is { item } |
