<template>
  <v-card outlined class="operational-cards">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <h3 class="mb-0">Lista Operacional</h3>
        <small class="text--secondary"
          >{{ contentList.length }} item(ns) na fila</small
        >
      </div>
    </v-card-title>

    <v-card-text class="pt-2">
      <div class="section-header">Ativo agora</div>

      <v-card
        v-if="activeItem"
        outlined
        class="queue-item queue-item--active mb-4"
      >
        <v-card-text class="py-3">
          <div class="d-flex align-start justify-space-between card-top">
            <div class="card-content">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <div class="item-name text-truncate" v-bind="attrs" v-on="on">
                    {{ activeItem.name }}
                  </div>
                </template>
                <span>{{ activeItem.name }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <div
                    class="item-context text-truncate"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ getContentContext(activeItem) }}
                  </div>
                </template>
                <span>{{ getContentContext(activeItem) }}</span>
              </v-tooltip>
            </div>
            <v-chip
              class="queue-type-chip"
              x-small
              :color="activeItem.type === 'bible' ? 'primary' : 'secondary'"
              dark
            >
              {{ activeItem.type === 'bible' ? 'Bíblia' : 'Texto rápido' }}
            </v-chip>
          </div>

          <div class="card-middle mt-2">
            <v-chip x-small color="success" outlined class="status-chip">
              Em transmissão
            </v-chip>
          </div>

          <div class="d-flex align-center justify-end mt-3 actions-wrap">
            <v-btn
              small
              text
              color="success"
              @click="$emit('show', activeItem)"
            >
              Exibir
            </v-btn>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                  @click="$emit('remove', getOriginalIndex(activeItem))"
                >
                  <v-icon small>{{ mdiTrashCan }}</v-icon>
                </v-btn>
              </template>
              <span>Remover da fila</span>
            </v-tooltip>
          </div>
        </v-card-text>
      </v-card>

      <v-alert v-else dense text type="info" class="mb-4">
        Nenhum conteúdo ativo no momento.
      </v-alert>

      <div class="section-header">Na fila</div>
      <v-alert v-if="!pendingItems.length" dense text type="info">
        Nenhum item pendente na fila.
      </v-alert>

      <div v-else class="pending-list">
        <v-card
          v-for="item in pendingItems"
          :key="item.id"
          outlined
          class="queue-item queue-item--pending"
        >
          <v-card-text class="py-3">
            <div class="d-flex align-start justify-space-between card-top">
              <div class="card-content">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <div
                      class="item-name text-truncate"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ item.name }}
                    </div>
                  </template>
                  <span>{{ item.name }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <div
                      class="item-context text-truncate"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ getContentContext(item) }}
                    </div>
                  </template>
                  <span>{{ getContentContext(item) }}</span>
                </v-tooltip>
              </div>
              <v-chip
                class="queue-type-chip"
                x-small
                :color="item.type === 'bible' ? 'primary' : 'secondary'"
                dark
              >
                {{ item.type === 'bible' ? 'Bíblia' : 'Texto rápido' }}
              </v-chip>
            </div>

            <div class="d-flex align-center justify-end mt-3 actions-wrap">
              <v-btn small text color="success" @click="$emit('show', item)">
                Exibir
              </v-btn>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    color="error"
                    v-bind="attrs"
                    v-on="on"
                    @click="$emit('remove', getOriginalIndex(item))"
                  >
                    <v-icon small>{{ mdiTrashCan }}</v-icon>
                  </v-btn>
                </template>
                <span>Remover da fila</span>
              </v-tooltip>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiTrashCan } from '@mdi/js';
import { createModelSlug } from '@/store/content/helpers';

export default {
  name: 'OperationalContentList',
  props: {
    contentList: {
      type: Array,
      default: () => [],
    },
    quickTextTemplates: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    mdiTrashCan,
  }),
  computed: {
    activeItem() {
      return this.contentList.find(item => item.active) || null;
    },
    pendingItems() {
      return this.contentList.filter(item => !item.active);
    },
  },
  methods: {
    getOriginalIndex(item) {
      return this.contentList.findIndex(
        currentItem => currentItem.id === item.id,
      );
    },
    getTemplateName(templateId) {
      return (
        this.quickTextTemplates.find(template => template.id === templateId)
          ?.name || 'Modelo removido'
      );
    },
    getTemplateModel(templateId) {
      const template = this.quickTextTemplates.find(
        currentTemplate => currentTemplate.id === templateId,
      );

      if (!template) {
        return 'modelo-removido';
      }

      return template.model || createModelSlug(template.name || template.id);
    },
    getContentContext(item) {
      if (item.type === 'bible') {
        return `${String(item.version).toUpperCase()} - ${item.book.name} ${
          item.chapter
        }`;
      }

      return `${this.getTemplateName(item.templateId)} (${this.getTemplateModel(
        item.templateId,
      )})`;
    },
  },
};
</script>

<style lang="sass" scoped>
.operational-cards
  .section-header
    color: rgba(0, 0, 0, 0.65)
    font-size: 0.78rem
    font-weight: 700
    letter-spacing: 0.06em
    margin-bottom: 10px
    text-transform: uppercase

.queue-item
  border-radius: 12px
  transition: box-shadow 0.2s ease, border-color 0.2s ease

  &--active
    border-color: rgba(76, 175, 80, 0.3) !important
    box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.1)

  &--pending + .queue-item--pending
    margin-top: 10px

.card-top
  gap: 8px

.card-content
  flex: 1 1 auto
  min-width: 0

.queue-type-chip
  align-self: flex-start
  flex: 0 0 auto
  margin-left: 8px

.item-name
  color: rgba(0, 0, 0, 0.88)
  font-weight: 500
  line-height: 1.25

.item-context
  color: rgba(0, 0, 0, 0.55)
  font-size: 0.76rem
  line-height: 1.2
  margin-top: 3px

.text-truncate
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.card-middle
  min-height: 20px

.status-chip
  font-weight: 600

.actions-wrap
  display: flex
  align-items: center
  gap: 4px

.pending-list
  padding-bottom: 2px
</style>
