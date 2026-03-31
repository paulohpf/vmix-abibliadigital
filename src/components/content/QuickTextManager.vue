<template>
  <div>
    <v-alert
      v-if="feedback.message"
      dense
      text
      :type="feedback.type"
      class="mb-3"
    >
      {{ feedback.message }}
    </v-alert>

    <v-row dense class="manager-overview mb-3">
      <v-col cols="12" sm="6">
        <v-sheet outlined rounded class="manager-stat">
          <small class="text--secondary">Modelos disponíveis</small>
          <div class="manager-stat__value">{{ quickTextTemplates.length }}</div>
        </v-sheet>
      </v-col>
      <v-col cols="12" sm="6">
        <v-sheet outlined rounded class="manager-stat">
          <small class="text--secondary">Conteúdos salvos</small>
          <div class="manager-stat__value">{{ quickTextItems.length }}</div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-expansion-panels v-model="openPanels" multiple flat>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div>
            <strong>1. Criar ou editar conteúdo rápido</strong>
            <div class="text--secondary expansion-subtitle">
              Escolha um modelo, preencha os campos e salve para usar na fila.
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="panel-toolbar">
            <v-btn
              small
              text
              color="primary"
              @click="$emit('open-template-manager')"
            >
              Gerenciar modelos
            </v-btn>
            <v-btn small text color="primary" @click="resetQuickTextForm">
              Novo conteúdo
            </v-btn>
          </div>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-select
                v-model="quickTextForm.templateId"
                :items="quickTextTemplates"
                item-text="name"
                item-value="id"
                label="Modelo"
                dense
                outlined
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="6" class="d-flex align-center">
              <small class="text--secondary">
                Campos obrigatórios precisam ser preenchidos antes de salvar.
              </small>
            </v-col>
          </v-row>

          <v-row v-if="selectedTemplate" dense class="mt-1">
            <v-col
              v-for="field in orderedTemplateFields(selectedTemplate)"
              :key="field.id"
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="quickTextForm.values[field.id]"
                :label="field.label"
                :placeholder="field.placeholder"
                :hint="field.required ? 'Obrigatório' : roleLabel(field.role)"
                persistent-hint
                dense
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <div class="d-flex flex-wrap form-actions mt-3">
            <v-btn
              color="primary"
              small
              :disabled="!selectedTemplate"
              @click="saveQuickTextContent"
            >
              {{ quickTextForm.id ? 'Salvar alterações' : 'Salvar conteúdo' }}
            </v-btn>
            <v-btn small text @click="resetQuickTextForm">Limpar</v-btn>
          </div>

          <v-divider class="my-4" />

          <div class="section-header mb-3">
            <div>
              <h4 class="mb-0">Conteúdos salvos por modelo</h4>
              <small class="text--secondary">
                Cada modelo mantém sua própria lista de textos rápidos.
              </small>
            </div>
          </div>

          <v-expansion-panels flat accordion>
            <v-expansion-panel
              v-for="group in groupedQuickTextItems"
              :key="group.template.id"
            >
              <v-expansion-panel-header>
                <div class="group-header">
                  <div>
                    <strong>{{ group.template.name }}</strong>
                    <div class="text--secondary expansion-subtitle">
                      {{ group.items.length }} conteúdo(s) neste modelo
                    </div>
                  </div>
                  <v-chip x-small outlined color="primary">
                    {{ group.items.length }}
                  </v-chip>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="groupedQuickTextHeaders"
                  :items="group.items"
                  :items-per-page="5"
                  :footer-props="footerProps"
                  dense
                  :no-data-text="`Nenhum conteúdo salvo para ${group.template.name}.`"
                >
                  <template #[`item.actions`]="{ item }">
                    <div class="d-flex align-center flex-wrap table-actions">
                      <v-btn
                        small
                        text
                        color="primary"
                        @click="editQuickTextItem(item)"
                      >
                        Editar
                      </v-btn>
                      <v-btn
                        small
                        text
                        color="secondary"
                        @click="queueQuickTextItem(item)"
                      >
                        Fila
                      </v-btn>
                      <v-btn
                        small
                        text
                        color="success"
                        @click="showQuickTextItem(item)"
                      >
                        Exibir
                      </v-btn>
                      <v-btn small icon @click="removeQuickTextItem(item.id)">
                        <v-icon small>{{ mdiTrashCan }}</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mdiTrashCan } from '@mdi/js';
import {
  buildQuickTextDisplayName,
  buildQuickTextExportData,
  createDefaultQuickTextTemplate,
  createId,
  validateQuickTextValues,
} from '@/store/content/helpers';

export default {
  name: 'QuickTextManager',
  data: () => ({
    mdiTrashCan,
    openPanels: [0],
    feedback: {
      message: '',
      type: 'info',
    },
    footerProps: {
      'items-per-page-options': [5, 10, 20],
      'items-per-page-text': 'Linhas por página',
      'page-text': '{0}-{1} de {2}',
    },
    groupedQuickTextHeaders: [
      { text: 'Conteúdo', value: 'name' },
      { text: 'Ações', value: 'actions', sortable: false },
    ],
    quickTextForm: {
      id: null,
      templateId: null,
      values: {},
      active: false,
    },
  }),
  computed: {
    quickTextTemplates() {
      return this.$store.getters.getQuickTextTemplates || [];
    },
    quickTextItems() {
      return this.$store.getters.getQuickTextItems || [];
    },
    groupedQuickTextItems() {
      return this.quickTextTemplates.map(template => ({
        template,
        items: this.quickTextItems.filter(
          item => item.templateId === template.id,
        ),
      }));
    },
    selectedTemplate() {
      return (
        this.quickTextTemplates.find(
          template => template.id === this.quickTextForm.templateId,
        ) || null
      );
    },
  },
  watch: {
    quickTextTemplates: {
      immediate: true,
      handler(templates) {
        if (!templates.length) {
          this.quickTextForm.templateId = null;
          return;
        }

        const exists = templates.some(
          template => template.id === this.quickTextForm.templateId,
        );

        if (!exists) {
          this.quickTextForm.templateId = templates[0].id;
          this.syncQuickTextValuesWithTemplate();
        }
      },
    },
    'quickTextForm.templateId': {
      handler() {
        this.syncQuickTextValuesWithTemplate();
      },
    },
  },
  created() {
    if (!this.quickTextTemplates.length) {
      this.$store.commit(
        'saveQuickTextTemplate',
        createDefaultQuickTextTemplate(),
      );
    }
  },
  methods: {
    orderedTemplateFields(template) {
      return [...template.fields].sort((a, b) => a.order - b.order);
    },
    roleLabel(role) {
      if (role === 'text') return 'Vai para o texto principal';
      if (role === 'info') return 'Vai para a informação extra';
      return 'Campo interno do modelo';
    },
    setFeedback(message, type = 'info') {
      this.feedback = { message, type };
    },
    syncQuickTextValuesWithTemplate() {
      const template = this.selectedTemplate;

      if (!template) {
        this.quickTextForm.values = {};
        return;
      }

      const nextValues = {};

      this.orderedTemplateFields(template).forEach(field => {
        nextValues[field.id] = this.quickTextForm.values[field.id] || '';
      });

      this.quickTextForm.values = nextValues;
    },
    resetQuickTextForm() {
      this.quickTextForm = {
        id: null,
        templateId: this.quickTextTemplates[0]?.id || null,
        values: {},
        active: false,
      };
      this.syncQuickTextValuesWithTemplate();
    },
    editQuickTextItem(item) {
      this.quickTextForm = {
        id: item.id,
        templateId: item.templateId,
        values: { ...item.values },
        active: item.active,
      };
      this.syncQuickTextValuesWithTemplate();
    },
    saveQuickTextContent() {
      const template = this.selectedTemplate;

      if (!template) {
        this.setFeedback('Selecione um modelo antes de salvar.', 'warning');
        return;
      }

      const validationMessage = validateQuickTextValues(
        template,
        this.quickTextForm.values,
      );

      if (validationMessage) {
        this.setFeedback(validationMessage, 'warning');
        return;
      }

      const content = {
        id: this.quickTextForm.id || createId('quick-text'),
        type: 'quickText',
        templateId: template.id,
        values: { ...this.quickTextForm.values },
        name: buildQuickTextDisplayName(template, this.quickTextForm.values),
        active: Boolean(this.quickTextForm.active),
        exportData: buildQuickTextExportData(
          template,
          this.quickTextForm.values,
        ),
      };

      this.$store.commit('saveQuickTextItem', content);
      this.resetQuickTextForm();
      this.setFeedback('Texto rápido salvo com sucesso.', 'success');
    },
    queueQuickTextItem(item) {
      this.$store.commit('upsertQuickTextItemInList', {
        ...item,
        active: false,
      });
      this.setFeedback(
        'Texto rápido adicionado à fila operacional.',
        'success',
      );
    },
    showQuickTextItem(item) {
      this.$store.commit('upsertQuickTextItemInList', item);
      this.$emit('show-content', item);
    },
    removeQuickTextItem(itemId) {
      this.$store.commit('removeQuickTextItem', itemId);
      if (this.quickTextForm.id === itemId) {
        this.resetQuickTextForm();
      }
      this.setFeedback('Texto rápido removido.', 'info');
    },
  },
};
</script>

<style lang="sass" scoped>
.manager-stat
  padding: 12px 14px

.manager-stat__value
  font-size: 1.45rem
  font-weight: 700
  line-height: 1.2
  margin-top: 8px

.panel-toolbar
  display: flex
  justify-content: flex-end
  margin-bottom: 8px

.section-header
  display: flex
  justify-content: space-between
  align-items: center

.group-header
  align-items: center
  display: flex
  justify-content: space-between
  width: 100%

.expansion-subtitle
  font-size: 0.85rem
  margin-top: 4px

.form-actions
  gap: 8px

.table-actions
  gap: 4px
</style>
