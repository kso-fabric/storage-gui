
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import DirectoryPath from '../components/DirectoryPath.vue';
import DirectoryContent from '../components/DirectoryContent.vue';
import ItemDetail from '../components/ItemDetail.vue';

import * as api from '../api/storageApi';

import type {
  DirectoryMetadata,
  StorageItem
} from '../api/models';

const directoryPath = ref<DirectoryMetadata[]>([]);

const selectedItem = ref<StorageItem | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const loading = ref(false);
const error = ref<string | null>(null);

const currentDirectoryId = computed(
    () => directoryPath.value.at(-1)?.id ?? null
);

const items = ref<StorageItem[]>([]);

const directories = computed(() =>
    items.value.filter(item => item.type === 'DIRECTORY')
);

const files = computed(() =>
    items.value.filter(item => item.type === 'FILE')
);

async function execute(action: () => Promise<void>) {
  if (loading.value) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await action();
  } catch (e) {
    error.value = e instanceof Error
        ? e.message
        : String(e);
  } finally {
    loading.value = false;
  }
}

async function loadContent(directoryId: string | null) {
  items.value = (await api.listItems(directoryId))
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'DIRECTORY' ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });
}

async function refresh() {
  await execute(async () => {
    await loadContent(currentDirectoryId.value);
    selectedItem.value = null;
  });
}

async function openDirectory(id: string) {
  await execute(async () => {
    const directory = await api.getDirectory(id);

    await loadContent(id);

    directoryPath.value.push(directory);
    selectedItem.value = null;
  });
}

async function navigate(id: string | null) {
  await execute(async () => {
    const index = directoryPath.value.findIndex(
        directory => directory.id === id
    );

    await loadContent(id);

    directoryPath.value = id === null
        ? []
        : directoryPath.value.slice(0, index + 1);

    selectedItem.value = null;
  });
}

async function showInfo(item: StorageItem) {
  await execute(async () => {
    selectedItem.value = item.type === 'FILE'
        ? await api.getFile(item.id)
        : await api.getDirectory(item.id);
  });
}

async function removeItem(item: StorageItem) {
  if (!confirm(`Delete "${item.name}"?`)) {
    return;
  }

  await execute(async () => {
    if (item.type === 'FILE') {
      await api.deleteFile(item.id);
    } else {
      await api.deleteDirectory(item.id);
    }

    selectedItem.value = null;

    await loadContent(currentDirectoryId.value);
  });
}

async function newDirectory() {
  const name = prompt('Directory name:')?.trim();

  if (!name) {
    return;
  }

  await execute(async () => {
    await api.createDirectory(
        name,
        currentDirectoryId.value
    );

    await loadContent(currentDirectoryId.value);
  });
}

async function uploadFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  const selectedFiles = Array.from(input.files ?? []);

  input.value = '';

  if (!selectedFiles.length) {
    return;
  }

  await execute(async () => {
    try {
      for (const file of selectedFiles) {
        await api.uploadFile(
            file,
            currentDirectoryId.value
        );
      }
    } finally {
      await loadContent(currentDirectoryId.value);
    }
  });
}

onMounted(refresh);
</script>

<template>
  <div class="storage-view">
    <header class="app-header">
      <h2>Fabric Storage</h2>
    </header>

    <div class="toolbar">
      <DirectoryPath
          :path="directoryPath"
          @navigate="navigate"
      />

      <div class="toolbar-actions">
        <button
            :disabled="loading"
            @click="refresh"
        >
          Refresh
        </button>

        <button
            :disabled="loading"
            @click="newDirectory"
        >
          New directory
        </button>

        <button
            :disabled="loading"
            @click="fileInput?.click()"
        >
          Upload
        </button>

        <input
            ref="fileInput"
            type="file"
            multiple
            hidden
            @change="uploadFiles"
        >
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
      <button @click="error = null">✕</button>
    </div>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <main class="workspace">
      <section
          class="directory-content"
          :inert="loading"
      >
        <DirectoryContent
            :items="items"
            @open="openDirectory"
            @info="showInfo"
            @delete="removeItem"
            @download="api.downloadFile"
        />
      </section>

      <ItemDetail
          v-if="selectedItem"
          :item="selectedItem"
          @close="selectedItem = null"
      />
    </main>

    <footer>
      {{ directories.length }} directories ·
      {{ files.length }} files
    </footer>
  </div>
</template>

<style scoped>
.storage-view {
  display: flex;
  flex-direction: column;
  height: 100dvh;
}

.app-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  padding: 12px;
}

.workspace {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.directory-content {
  flex: 1;
  min-width: 0;
  overflow: auto;
}

.error {
  padding: 12px;
  background: #552222;
  color: #ffbaba;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading {
  padding: 8px 16px;
  color: var(--muted);
}

footer {
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 12px;
}
</style>
