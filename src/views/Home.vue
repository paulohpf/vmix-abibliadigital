<template>
  <div class="home pa-4">
    <div class="home-status mb-3">
      <v-sheet outlined rounded class="status-strip">
        <div class="status-item">
          <span class="status-label">Versículos</span>
          <strong class="status-value">{{ verses.length }}</strong>
        </div>
        <v-divider vertical />
        <div class="status-item">
          <span class="status-label">Fila</span>
          <strong class="status-value">{{ contentList.length }}</strong>
        </div>
        <v-divider vertical />
        <div class="status-item status-item--active">
          <span class="status-label">Ativo</span>
          <strong class="status-value status-value--active">{{
            activeContentName
          }}</strong>
        </div>
      </v-sheet>
    </div>

    <v-alert
      v-if="showHelp"
      class="mb-3 compact-help"
      border="left"
      colored-border
      type="info"
      dense
      text
    >
      <div class="d-flex align-center justify-space-between mb-1">
        <strong>Fluxo rápido da operação</strong>
        <v-btn small text @click="hideHelp">Ocultar</v-btn>
      </div>
      <div class="help-text">
        1) Selecione versão, livro e capítulo.<br />
        2) Clique em <strong>Buscar</strong> para carregar os versículos.<br />
        3) Revise e use <strong>Adicionar à fila</strong>.<br />
        4) Na fila operacional, clique em <strong>Exibir</strong>.
      </div>
    </v-alert>

    <v-alert v-else class="mb-3 compact-help-closed" dense text type="info">
      <div class="d-flex align-center justify-space-between">
        <span
          >Fluxo: selecionar passagem, revisar, adicionar à fila e exibir.</span
        >
        <v-btn small text color="primary" @click="showHelpAgain">
          <v-icon left small>{{ icons.mdiHelpCircleOutline }}</v-icon>
          Ver ajuda completa
        </v-btn>
      </div>
    </v-alert>

    <v-row id="contentcontainer" class="content-row overflow-y-auto pt-1">
      <v-col cols="12" lg="8">
        <v-card outlined class="workspace-card">
          <v-card-title class="workspace-title">
            <div>
              <h3 class="mb-0">Área de preparo</h3>
              <small class="text--secondary">
                Primeiro monte o conteúdo. Depois envie para a fila operacional.
              </small>
            </div>
          </v-card-title>

          <v-tabs v-model="workspaceTab" background-color="transparent" grow>
            <v-tab>Passagem Bíblica</v-tab>
            <v-tab>Textos Rápidos</v-tab>
          </v-tabs>

          <v-divider />

          <v-tabs-items v-model="workspaceTab" class="workspace-tabs">
            <v-tab-item>
              <div class="workspace-panel">
                <BiblePassagePanel />

                <div class="d-flex align-center justify-space-between mb-3">
                  <div>
                    <h4 class="mb-0">Pré-visualização dos versículos</h4>
                    <small class="text--secondary">
                      Revise o texto carregado antes de adicionar à lista
                      operacional.
                    </small>
                  </div>
                  <v-chip small outlined color="primary">
                    {{ verses.length }} registro(s)
                  </v-chip>
                </div>

                <v-data-table
                  :headers="bibleTable.headers"
                  :items="verses"
                  :items-per-page="bibleTable.itemsPerPage"
                  :footer-props="bibleTable.footerProps"
                  :mobile-breakpoint="0"
                  item-key="number"
                  dense
                  no-data-text="Selecione versão, livro e capítulo para carregar os versículos."
                />
              </div>
            </v-tab-item>

            <v-tab-item>
              <div class="workspace-panel">
                <QuickTextManager
                  @show-content="showContent"
                  @open-template-manager="openTemplateManager"
                />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col ref="contentList" cols="12" lg="4">
        <div class="queue-column">
          <h3 class="queue-title mb-2">Fila operacional</h3>
          <small class="text--secondary d-block mb-3">
            Tudo que pode ir para transmissão fica aqui. Apenas um item
            permanece ativo por vez.
          </small>

          <OperationalContentList
            :content-list="contentList"
            :quick-text-templates="quickTextTemplates"
            @show="showContent"
            @remove="removeContent"
          />
        </div>
      </v-col>
    </v-row>

    <v-btn
      v-if="$vuetify.breakpoint.smAndDown"
      color="primary"
      small
      class="mobile-list-fab"
      @click="openContentList"
    >
      <v-icon left small>{{ icons.mdiViewList }}</v-icon>
      Lista ({{ contentList.length }})
    </v-btn>

    <QuickTextTemplateManagerDialog
      v-model="templateManagerDialog"
      @input="templateManagerDialog = $event"
    />
  </div>
</template>

<script>
import { mdiViewList, mdiHelpCircleOutline } from '@mdi/js';

export default {
  components: {
    BiblePassagePanel: () => import('@/components/bible/BiblePassagePanel.vue'),
    QuickTextManager: () => import('@/components/content/QuickTextManager.vue'),
    OperationalContentList: () =>
      import('@/components/content/OperationalContentList.vue'),
    QuickTextTemplateManagerDialog: () =>
      import('@/components/content/QuickTextTemplateManagerDialog.vue'),
  },
  data: () => ({
    icons: {
      mdiViewList,
      mdiHelpCircleOutline,
    },
    showHelp: false,
    templateManagerDialog: false,
    workspaceTab: 0,
    bibleTable: {
      itemsPerPage: 25,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
        'items-per-page-text': 'Linhas por página',
        'page-text': '{0}-{1} de {2}',
      },
      headers: [
        {
          text: 'Versículo',
          align: 'start',
          value: 'number',
        },
        {
          text: 'Texto',
          align: 'start',
          value: 'text',
        },
      ],
    },
  }),
  computed: {
    verses() {
      return this.$store.getters.getCurrentBibleChapter || [];
    },
    contentList() {
      return this.$store.getters.getContentList || [];
    },
    quickTextTemplates() {
      return this.$store.getters.getQuickTextTemplates || [];
    },
    activeContentName() {
      return this.contentList.find(item => item.active)?.name || 'Nenhum';
    },
  },
  created() {
    const hiddenHelp = localStorage.getItem('vmix-biblia-live-hide-help');
    this.showHelp = this.resolveInitialHelpVisibility(hiddenHelp);
    this.migrateLegacyBibleStateFromStorage();
    this.$store.dispatch('hydrateLegacyContentState');
  },
  methods: {
    getPersistedStoreData() {
      const rawPersistedData = localStorage.getItem('vuex');

      if (!rawPersistedData) {
        return null;
      }

      try {
        const parsed = JSON.parse(rawPersistedData);
        return parsed && typeof parsed === 'object' ? parsed : null;
      } catch {
        return null;
      }
    },
    migrateLegacyBibleStateFromStorage() {
      const markerKey = 'vmix-content-migration-v1';

      if (localStorage.getItem(markerKey) === 'done') {
        return;
      }

      const persistedData = this.getPersistedStoreData();

      this.$store.dispatch(
        'migrateLegacyBibleState',
        persistedData && persistedData.bible ? persistedData.bible : null,
      );

      localStorage.setItem(markerKey, 'done');
    },
    resolveInitialHelpVisibility(hiddenHelp) {
      if (hiddenHelp === 'true') return false;
      if (hiddenHelp === 'false') return true;
      return this.$vuetify.breakpoint.smAndDown;
    },
    hideHelp() {
      this.showHelp = false;
      localStorage.setItem('vmix-biblia-live-hide-help', 'true');
    },
    showHelpAgain() {
      this.showHelp = true;
      localStorage.setItem('vmix-biblia-live-hide-help', 'false');
    },
    openTemplateManager() {
      this.templateManagerDialog = true;
    },
    openContentList() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('#contentcontainer');
        const contentList =
          this.$refs.contentList?.$el || this.$refs.contentList;

        if (container && contentList) {
          container.scrollTop = contentList.offsetTop - 8;
        }
      });
    },
    showContent(content) {
      if (window.myAPI && content?.exportData?.length) {
        const target = content.type === 'quickText' ? 'quickText' : 'bible';
        const saveMethod =
          window.myAPI.saveContentJson || window.myAPI.saveBibleJson;

        saveMethod({
          data: content.exportData,
          nodeEnv: process.env.NODE_ENV,
          target,
        });

        this.$store.commit('updateActiveContent', content.id);
      }
    },
    removeContent(index) {
      this.$store.commit('removeContentFromList', index);
    },
  },
};
</script>

<style lang="sass" scoped>
.content-row
  max-height: calc(100vh - 160px)

.home-status
  margin-top: 4px

.status-strip
  align-items: center
  border-radius: 14px
  display: grid
  gap: 0
  grid-template-columns: 1fr auto 1fr auto 2fr
  min-height: 62px
  padding: 6px 8px

.status-item
  display: flex
  flex-direction: column
  gap: 2px
  padding: 8px 12px

.status-item--active
  min-width: 0

.status-label
  color: rgba(0, 0, 0, 0.55)
  font-size: 0.72rem
  letter-spacing: 0.04em
  text-transform: uppercase

.status-value
  color: rgba(0, 0, 0, 0.88)
  font-size: 1.15rem
  font-weight: 700
  line-height: 1.2

.status-value--active
  display: block
  font-size: 0.96rem
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.workspace-card
  border-radius: 18px
  overflow: hidden

.workspace-title
  padding-bottom: 10px

.workspace-tabs
  background: #fafafa

.workspace-panel
  padding: 18px

.queue-column
  position: sticky
  top: 0

.queue-title
  font-size: 1.3rem
  line-height: 1.2

.help-text
  line-height: 1.45

.compact-help,
.compact-help-closed
  border-radius: 12px

@media (max-width: 960px)
  .home
    padding: 8px !important

  .content-row
    max-height: calc(100vh - 250px)

  .queue-column
    position: static

  .status-strip
    grid-template-columns: 1fr
    gap: 8px
    padding: 10px

    .v-divider--vertical
      display: none

@media (max-width: 1264px)
  .content-row
    max-height: none

  .queue-column
    position: static

@media (max-width: 600px)
  .content-row
    max-height: calc(100vh - 360px)

  .compact-help-closed
    ::v-deep .v-alert__content > div
      align-items: flex-start
      flex-direction: column
      gap: 6px

  .mobile-list-fab
    position: fixed
    right: 12px
    bottom: 12px
    z-index: 12
</style>
