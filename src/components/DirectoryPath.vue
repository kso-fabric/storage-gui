
<script setup lang="ts">
import type { DirectoryMetadata } from '../api/models';

defineProps<{
  path: DirectoryMetadata[];
}>();

const emit = defineEmits<{
  navigate: [id: string | null];
}>();
</script>

<template>
  <nav class="directory-path">
    <button @click="emit('navigate', null)">
      Root
    </button>

    <template
        v-for="directory in path"
        :key="directory.id"
    >
      <span>/</span>

      <button @click="emit('navigate', directory.id)">
        {{ directory.name }}
      </button>
    </template>
  </nav>
</template>

<style scoped>
.directory-path {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
}

.directory-path button {
  border: none;
  background: transparent;
}

.directory-path button:hover {
  text-decoration: underline;
}
</style>
