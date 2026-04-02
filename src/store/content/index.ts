import { ChapterVerse } from '@/providers/interface';
import { ActionContext } from 'vuex';
import {
  cloneOperationalContent,
  createDefaultQuickTextTemplate,
  LegacyBibleState,
  mergeLegacyBibleState,
  normalizeOperationalContentList,
  normalizeQuickTextItems,
  normalizeQuickTextTemplates,
  sanitizeTemplate,
  syncQuickTextContentWithTemplate,
} from './helpers';
import {
  ContentState,
  OperationalContent,
  QuickTextContent,
  QuickTextTemplate,
} from './interface';

const defaultTemplate = createDefaultQuickTextTemplate();
type ContentActionContext = ActionContext<ContentState, unknown>;

export default {
  state: (): ContentState => ({
    currentBibleChapter: [],
    contentList: [],
    quickTextTemplates: [JSON.parse(JSON.stringify(defaultTemplate))],
    quickTextItems: [],
  }),
  plugins: [],
  mutations: {
    migrateLegacyBibleState(
      state: ContentState,
      legacyBibleState: LegacyBibleState | null | undefined,
    ): void {
      const migratedState = mergeLegacyBibleState({
        existingContentList: state.contentList,
        existingCurrentBibleChapter: state.currentBibleChapter,
        legacyBibleState,
      });

      state.contentList = migratedState.contentList;
      state.currentBibleChapter = migratedState.currentBibleChapter;
    },
    hydrateLegacyContentState(state: ContentState): void {
      const normalizedTemplates = normalizeQuickTextTemplates(
        state.quickTextTemplates,
      );
      const normalizedQuickTextItems = normalizeQuickTextItems(
        state.quickTextItems,
        normalizedTemplates,
      );

      state.quickTextTemplates = normalizedTemplates;
      state.quickTextItems = normalizedQuickTextItems;
      state.contentList = normalizeOperationalContentList(
        state.contentList,
        normalizedTemplates,
      );
    },
    setCurrentBibleChapter(state: ContentState, chapter: ChapterVerse[]): void {
      state.currentBibleChapter = chapter;
    },
    addContentToList(state: ContentState, content: OperationalContent): void {
      state.contentList.push(cloneOperationalContent(content));
    },
    updateActiveContent(state: ContentState, contentId: string): void {
      state.contentList = state.contentList.map(item => ({
        ...item,
        active: item.id === contentId,
      }));
    },
    removeContentFromList(state: ContentState, itemId: number): void {
      state.contentList.splice(itemId, 1);
    },
    saveQuickTextTemplate(
      state: ContentState,
      template: QuickTextTemplate,
    ): void {
      const normalizedTemplate = sanitizeTemplate(template);
      const existingIndex = state.quickTextTemplates.findIndex(
        item => item.id === normalizedTemplate.id,
      );

      if (existingIndex >= 0) {
        state.quickTextTemplates.splice(existingIndex, 1, normalizedTemplate);
      } else {
        state.quickTextTemplates.push(normalizedTemplate);
      }

      state.quickTextItems = state.quickTextItems.map(item => {
        if (item.templateId !== normalizedTemplate.id) {
          return item;
        }

        return syncQuickTextContentWithTemplate(item, normalizedTemplate);
      });

      state.contentList = state.contentList.map(item => {
        if (
          item.type !== 'quickText' ||
          item.templateId !== normalizedTemplate.id
        ) {
          return item;
        }

        return syncQuickTextContentWithTemplate(item, normalizedTemplate);
      });
    },
    removeQuickTextTemplate(state: ContentState, templateId: string): void {
      state.quickTextTemplates = state.quickTextTemplates.filter(
        template => template.id !== templateId,
      );
      state.quickTextItems = state.quickTextItems.filter(
        item => item.templateId !== templateId,
      );
      state.contentList = state.contentList.filter(item => {
        return !(item.type === 'quickText' && item.templateId === templateId);
      });
    },
    saveQuickTextItem(state: ContentState, content: QuickTextContent): void {
      const itemCopy = cloneOperationalContent(content) as QuickTextContent;
      const existingIndex = state.quickTextItems.findIndex(
        item => item.id === itemCopy.id,
      );

      if (existingIndex >= 0) {
        state.quickTextItems.splice(existingIndex, 1, itemCopy);
      } else {
        state.quickTextItems.push(itemCopy);
      }

      state.contentList = state.contentList.map(item => {
        if (item.type !== 'quickText' || item.id !== itemCopy.id) {
          return item;
        }

        return { ...itemCopy, active: item.active };
      });
    },
    removeQuickTextItem(state: ContentState, itemId: string): void {
      state.quickTextItems = state.quickTextItems.filter(
        item => item.id !== itemId,
      );
      state.contentList = state.contentList.filter(item => item.id !== itemId);
    },
    upsertQuickTextItemInList(
      state: ContentState,
      item: QuickTextContent,
    ): void {
      const existingIndex = state.contentList.findIndex(
        content => content.id === item.id,
      );
      const contentToSave = cloneOperationalContent(item) as QuickTextContent;

      if (existingIndex >= 0) {
        state.contentList.splice(existingIndex, 1, contentToSave);
      } else {
        state.contentList.push(contentToSave);
      }
    },
  },
  getters: {
    getCurrentBibleChapter(state: ContentState): ChapterVerse[] {
      return state.currentBibleChapter;
    },
    getContentList(state: ContentState): OperationalContent[] {
      return state.contentList;
    },
    getQuickTextTemplates(state: ContentState): QuickTextTemplate[] {
      return state.quickTextTemplates;
    },
    getQuickTextItems(state: ContentState): QuickTextContent[] {
      return state.quickTextItems;
    },
  },
  actions: {
    migrateLegacyBibleState(
      { commit }: ContentActionContext,
      legacyBibleState: LegacyBibleState | null | undefined,
    ): void {
      commit('migrateLegacyBibleState', legacyBibleState);
    },
    hydrateLegacyContentState({ commit }: ContentActionContext): void {
      commit('hydrateLegacyContentState');
    },
  },
};
