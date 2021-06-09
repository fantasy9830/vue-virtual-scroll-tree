<template>
  <div class="demo">
    <VueVirtualScrollTree :data="treeData">
      <template v-slot="{ item }">
        <span>{{ item.label }}</span>
      </template>
    </VueVirtualScrollTree>
  </div>
</template>

<script>
import VueVirtualScrollTree from '@/components/VueVirtualScrollTree'

export default {
  name: 'Demo',
  components: {
    VueVirtualScrollTree
  },
  data () {
    return {
      treeData: [
        {
          label: 'L1 (1)',
          children: [
            {
              label: 'L2 (1-1)',
              children: [
                {
                  label: 'L3 (1-1-1)'
                }
              ]
            },
            {
              label: 'L3 (1-2)'
            },
            {
              label: 'L3 (1-3)'
            }
          ]
        },
        {
          label: 'L1 (2)',
          children: [
            {
              label: 'L2 (2-1)',
              children: [
                {
                  label: 'L3 (2-1-1)'
                },
                {
                  label: 'L3 (2-1-2)'
                }
              ]
            },
            {
              label: 'L2 (2-2)',
              children: [
                {
                  label: 'L3 (2-2-1)'
                }
              ]
            }
          ]
        },
        {
          label: 'L1 (3)',
          children: [
            {
              label: 'L2 (3-1)',
              children: [
                {
                  label: 'L3 (3-1-1)'
                }
              ]
            },
            {
              label: 'L2 (3-2)',
              children: [
                {
                  label: 'L3 (3-2-1)'
                }
              ]
            }
          ]
        },
        {
          label: 'L1 (4)'
        },
        {
          label: 'L1 (5)'
        },
        {
          label: 'L1 (6)'
        }
      ]
    }
  }
}
</script>
