<!--
 * @Author: yangmiaomiao
 * @Date: 2024-02-04 15:44:58
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-05-28 14:16:49
 * @Description: 
-->
<template>
    <div class="tool-bar-ri">
        <!-- <div class="header-icon">
            <Language id="language" />
            <SearchMenu id="searchMenu" />
            <Message id="message" />
        </div> -->
        <Avatar />
    </div>
</template>

<script setup lang="ts">
// import { computed } from "vue";
// import { useUserStore } from "@/stores/modules/user";
// import Language from './components/Language.vue'
// import SearchMenu from './components/SearchMenu.vue'
// import Message from './components/Message.vue'
import Avatar from './components/Avatar.vue'
</script>

<style scoped lang="scss">
.tool-bar-ri {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 25px;
    .header-icon {
        display: flex;
        align-items: center;
        & > * {
            margin-left: 21px;
            color: $color-white;
        }
    }
}
</style>
