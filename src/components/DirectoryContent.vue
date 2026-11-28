<script setup lang="ts">
import type {StorageItem} from '../api/models';

defineProps<{
  items: StorageItem[];
}>();

const emit = defineEmits<{
  open: [id: string];
  info: [item: StorageItem];
  delete: [item: StorageItem];
  download: [id: string];
}>();

function formatSize(bytes: number): string {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }

  return `${value.toFixed(unit === 0 ? 0 : 2)} ${units[unit]}`;
}
</script>

<template>
  <table>
    <thead>
    <tr>
      <th>Name</th>
      <th>Size</th>
      <th>Actions</th>
    </tr>
    </thead>

    <tbody>
    <tr
        v-for="item in items"
        :key="`${item.type}-${item.id}`"
        @click="emit('info', item)"
    >
      <td>
        <button
            v-if="item.type === 'DIRECTORY'"
            class="directory-name"
            @click.stop="emit('open', item.id)"
        >
          📁 {{ item.name }}
        </button>

        <span v-else>
                        📄 {{ item.name }}
                    </span>
      </td>

      <td>
        {{ formatSize(item.size) }}
      </td>

      <td class="actions">
        <button
            v-if="item.type === 'FILE'"
            @click.stop="emit('download', item.id)"
        >
          Download
        </button>

        <button @click.stop="emit('delete', item)">
          Delete
        </button>
      </td>
    </tr>

    <tr v-if="items.length === 0">
      <td colspan="3" class="empty">
        This directory is empty.
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  overflow-wrap: anywhere;
}

tbody tr:hover {
  background: var(--surface);
}

.directory-name {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.directory-name:hover {
  text-decoration: underline;
}

.actions {
  text-align: right;
  white-space: nowrap;
}

.actions button {
  margin-left: 5px;
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 30px;
}
</style>
