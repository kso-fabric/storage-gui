
<script setup lang="ts">
import type { StorageItem } from '../api/models';

defineProps<{
  item: StorageItem;
}>();

const emit = defineEmits<{
  close: [];
}>();

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}
</script>

<template>
  <aside class="detail-panel">
    <header>
      <h3>Information</h3>
      <button @click="emit('close')">✕</button>
    </header>

    <h2>{{ item.name }}</h2>

    <dl>
      <dt>ID</dt>
      <dd>{{ item.id }}</dd>

      <dt>Type</dt>
      <dd>{{ item.type }}</dd>

      <dt>Created at</dt>
      <dd>{{ formatDate(item.createdAt) }}</dd>

      <template v-if="item.type === 'file'">
        <dt>Size</dt>
        <dd>{{ item.size.toLocaleString() }} B</dd>

        <dt>Content type</dt>
        <dd>{{ item.contentType || '—' }}</dd>

        <dt>Checksum (SHA-256)</dt>
        <dd>{{ item.checksum }}</dd>

        <dt>Updated at</dt>
        <dd>
          {{ item.updatedAt
            ? formatDate(item.updatedAt)
            : '—' }}
        </dd>
      </template>
    </dl>

    <hr>

    <h3>Metadata</h3>

    <dl>
      <dt>Description</dt>
      <dd>{{ item.additionalData?.description || '—' }}</dd>

      <dt>Tags</dt>
      <dd class="tags">
                <span
                    v-for="tag in item.additionalData?.tags ?? []"
                    :key="tag"
                    class="tag"
                >
                    {{ tag }}
                </span>

        <span v-if="!item.additionalData?.tags?.length">
                    —
                </span>
      </dd>

      <dt>Custom</dt>
      <dd>
                <pre>{{ JSON.stringify(
                    item.additionalData?.custom ?? {},
                    null,
                    2
                ) }}</pre>
      </dd>
    </dl>
  </aside>
</template>

<style scoped>
.detail-panel {
  width: 340px;
  flex-shrink: 0;
  padding: 20px;
  border-left: 1px solid var(--border);
  background: var(--surface);
  overflow-y: auto;
  overflow-wrap: anywhere;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 20px 0;
}

dt {
  font-size: 12px;
  color: var(--muted);
  margin-top: 15px;
}

dd {
  margin: 5px 0 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  padding: 3px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 12px;
}
</style>
