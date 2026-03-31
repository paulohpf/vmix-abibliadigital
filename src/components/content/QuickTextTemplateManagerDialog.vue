<template>
  <v-dialog
    :value="value"
    max-width="980"
    scrollable
    @input="$emit('input', $event)"
  >
    <v-card class="template-dialog">
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <h3 class="mb-0">Gerenciar modelos de texto rápido</h3>
          <small class="text--secondary">
            Defina os campos usados para criar novos conteúdos rápidos.
          </small>
        </div>
        <v-btn icon @click="$emit('input', false)">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-4">
        <div class="panel-toolbar">
          <v-btn small text color="primary" @click="resetTemplateEditor">
            Novo modelo
          </v-btn>
        </div>

        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="templateEditor.name"
              label="Nome do modelo"
              dense
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <div
          v-for="(field, index) in templateEditor.fields"
          :key="field.id"
          class="template-field-row mb-3"
        >
          <v-row dense>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="field.label"
                label="Rótulo"
                dense
                outlined
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="field.placeholder"
                label="Placeholder"
                dense
                outlined
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="field.role"
                :items="fieldRoleOptions"
                item-text="text"
                item-value="value"
                label="Destino"
                dense
                outlined
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="field.required"
                label="Obrigatório"
                dense
                hide-details
                class="mt-0"
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
              <v-btn
                small
                text
                color="error"
                :disabled="templateEditor.fields.length === 1"
                @click="removeTemplateField(index)"
              >
                Remover
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-wrap form-actions">
          <v-btn small text color="primary" @click="addTemplateField">
            Adicionar campo
          </v-btn>
          <v-btn small color="primary" @click="saveTemplate">
            {{ templateEditor.id ? 'Salvar modelo' : 'Criar modelo' }}
          </v-btn>
        </div>

        <v-divider class="my-4" />

        <v-alert
          v-if="feedback.message"
          dense
          text
          :type="feedback.type"
          class="mb-3"
        >
          {{ feedback.message }}
        </v-alert>

        <v-data-table
          :headers="templateHeaders"
          :items="quickTextTemplates"
          :items-per-page="5"
          :footer-props="footerProps"
          dense
          no-data-text="Nenhum modelo cadastrado ainda."
        >
          <template #[`item.model`]="{ item }">
            <code>{{ item.model }}</code>
          </template>
          <template #[`item.fields`]="{ item }">
            {{ formatTemplateFields(item.fields) }}
          </template>
          <template #[`item.actions`]="{ item }">
            <div class="d-flex align-center flex-wrap table-actions">
              <v-btn small text color="primary" @click="editTemplate(item)">
                Editar
              </v-btn>
              <v-btn small icon @click="removeTemplate(item.id)">
                <v-icon small>{{ mdiTrashCan }}</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose, mdiTrashCan } from '@mdi/js';
import {
  createModelSlug,
  createId,
  validateQuickTextTemplate,
} from '@/store/content/helpers';

const createTemplateField = index => ({
  id: createId('field'),
  label: '',
  type: 'text',
  required: index === 0,
  placeholder: '',
  role: index === 0 ? 'text' : 'none',
  order: index,
});

const clone = value => JSON.parse(JSON.stringify(value));

export default {
  name: 'QuickTextTemplateManagerDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mdiClose,
    mdiTrashCan,
    feedback: {
      message: '',
      type: 'info',
    },
    fieldRoleOptions: [
      { text: 'Texto principal', value: 'text' },
      { text: 'Informação extra', value: 'info' },
      { text: 'Sem exportação', value: 'none' },
    ],
    footerProps: {
      'items-per-page-options': [5, 10, 20],
      'items-per-page-text': 'Linhas por página',
      'page-text': '{0}-{1} de {2}',
    },
    templateHeaders: [
      { text: 'Modelo', value: 'name' },
      { text: 'Identificador', value: 'model', sortable: false },
      { text: 'Campos', value: 'fields', sortable: false },
      { text: 'Ações', value: 'actions', sortable: false },
    ],
    templateEditor: {
      id: null,
      name: '',
      fields: [createTemplateField(0), createTemplateField(1)],
    },
  }),
  computed: {
    quickTextTemplates() {
      return this.$store.getters.getQuickTextTemplates || [];
    },
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
    resetTemplateEditor() {
      this.templateEditor = {
        id: null,
        name: '',
        fields: [createTemplateField(0), createTemplateField(1)],
      };
    },
    addTemplateField() {
      this.templateEditor.fields.push(
        createTemplateField(this.templateEditor.fields.length),
      );
    },
    removeTemplateField(index) {
      if (this.templateEditor.fields.length === 1) return;

      this.templateEditor.fields.splice(index, 1);
      this.templateEditor.fields = this.templateEditor.fields.map(
        (field, order) => ({
          ...field,
          order,
        }),
      );
    },
    editTemplate(template) {
      this.templateEditor = clone(template);
    },
    saveTemplate() {
      const normalizedTemplate = {
        id: this.templateEditor.id || createId('template'),
        model: createModelSlug(this.templateEditor.name),
        name: this.templateEditor.name,
        baseType: 'quickText',
        fields: this.templateEditor.fields.map((field, index) => ({
          ...field,
          order: index,
          type: 'text',
        })),
      };
      const validationMessage = validateQuickTextTemplate(normalizedTemplate);

      if (validationMessage) {
        this.setFeedback(validationMessage, 'warning');
        return;
      }

      this.$store.commit('saveQuickTextTemplate', normalizedTemplate);
      this.resetTemplateEditor();
      this.setFeedback('Modelo salvo com sucesso.', 'success');
    },
    removeTemplate(templateId) {
      this.$store.commit('removeQuickTextTemplate', templateId);
      this.resetTemplateEditor();
      this.setFeedback(
        'Modelo removido com seus conteúdos relacionados.',
        'info',
      );
    },
    formatTemplateFields(fields) {
      return this.orderedTemplateFields({ fields })
        .map(field => `${field.label} (${this.roleLabel(field.role)})`)
        .join(' | ');
    },
  },
};
</script>

<style lang="sass" scoped>
.template-dialog
  border-radius: 16px

.panel-toolbar
  display: flex
  justify-content: flex-end
  margin-bottom: 8px

.table-actions
  gap: 4px

.form-actions
  gap: 8px

.template-field-row
  border: 1px solid rgba(0, 0, 0, 0.08)
  border-radius: 8px
  padding: 8px
</style>
