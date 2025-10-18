const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type PriorityEnum = 'low' | 'medium' | 'high';
export type StatusEnum = 'new' | 'in_progress' | 'completed' | 'archived' | 'paused';
export type SuggestionTypeEnum = 'features' | 'phases' | 'improvements' | 'marketing' | 'validation';
export type RelationTypeEnum = 'related' | 'depends_on' | 'blocks' | 'similar' | 'inspired_by';

// Suggested Item from AI
export interface SuggestedItem {
  title: string
  description: string
  priority?: string
  type: "feature" | "phase"
}

// ==================== RELATED IDEAS TYPES ====================

export interface RelatedIdeaCreate {
  source_idea_id: string;
  target_idea_id: string;
  relation_type?: RelationTypeEnum;
  is_ai_suggested?: boolean;
  confidence_score?: number;
}

export interface RelatedIdeaUpdate {
  relation_type?: RelationTypeEnum;
  is_ai_suggested?: boolean;
}

export interface RelatedIdea {
  id: string;
  source_idea_id: string;
  target_idea_id: string;
  relation_type: RelationTypeEnum;
  is_ai_suggested: boolean;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}

export interface RelatedIdeaWithDetails extends RelatedIdea {
  idea: Idea;
}

export interface GraphNode {
  id: string;
  title: string;
  description?: string;
  priority: PriorityEnum;
  status: StatusEnum;
  tags: string[];
  overall_score?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation_type: RelationTypeEnum;
  is_ai_suggested: boolean;
  confidence_score?: number;
}

export interface IdeaGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  center_node_id: string;
}

export interface RecommendationItem {
  idea: Idea;
  similarity_score: number;
  recommended_relation_type: RelationTypeEnum;
  is_already_connected: boolean;
}

export interface RecommendationList {
  recommendations: RecommendationItem[];
  total: number;
  auto_created_count?: number;
}

// ==================== AI TYPES ====================

export interface AIGenerateRequest {
  idea_id: string;
  suggestion_type: SuggestionTypeEnum;
  context?: string;
}

export interface AISuggestion {
  id: string;
  user_id: string;
  idea_id: string;
  suggestion_type: string;
  suggestion_text: string;
  content: string | any;
  context?: string;
  confidence_score?: number;
  is_applied?: boolean;
  created_at: string;
}

export interface AIQueryLog {
  id: string;
  user_id: string;
  idea_id?: string;
  query_type: string;
  query_text: string;
  response_text: string;
  tokens_used?: number;
  created_at: string;
}

export interface CreateFromSuggestionRequest {
  suggestion_id: string
  item_type: "feature" | "phase"
  idea_id: string
  title?: string
  description?: string
  priority?: string
}

export interface CreateFromSuggestionResponse {
  item_type: string
  feature?: Feature
  phase?: Phase
  created_from_suggestion: string
}

// ==================== COMPETITOR TYPES ====================

export interface CompetitorResearch {
  id: string;
  idea_id: string;
  competitor_url: string;
  competitor_name?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  differentiation_opportunities?: string[];
  market_position?: string;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}

export interface CompetitorScrapeRequest {
  idea_id: string;
  urls: string[];
  analyze?: boolean;
}

// ==================== CATEGORY TYPES ====================

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  description?: string;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  color?: string;
  description?: string;
}

export interface CategoryUpdate {
  name?: string;
  color?: string;
  description?: string;
}

// ==================== IDEA TYPES ====================

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  capture_type: string;
  tags: string[];
  category_id?: string;
  priority: PriorityEnum;
  status: StatusEnum;
  effort_score?: number;
  impact_score?: number;
  interest_score?: number;
  overall_score?: number;
  progress_percentage: number;
  is_private: boolean;
  is_archived: boolean;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IdeaDetailResponse {
  idea: {
    idea: Idea;
    phases: Phase[];
    features: Feature[];
  };
}

export interface IdeaDetail {
  idea: Idea;
  phases: Phase[];
  features: Feature[];
}

export interface IdeaCreate {
  title: string;
  description?: string;
  tags?: string[];
  category_id?: string;
  priority?: PriorityEnum;
  status?: StatusEnum;
  effort_score?: number;
  impact_score?: number;
  interest_score?: number;
  capture_type?: string;
}

export interface IdeaUpdate {
  title?: string;
  description?: string;
  tags?: string[];
  category_id?: string;
  priority?: PriorityEnum;
  status?: StatusEnum;
  effort_score?: number;
  impact_score?: number;
  interest_score?: number;
  is_archived?: boolean;
}

export interface IdeaListParams {
  limit?: number;
  offset?: number;
  category_id?: string;
  tag?: string;
  priority?: PriorityEnum;
  status?: StatusEnum;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedIdeas {
  ideas: Idea[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// ==================== PHASE TYPES ====================

export interface Phase {
  id: string;
  idea_id: string;
  name: string;
  description?: string;
  order_index: number;
  is_completed: boolean;
  completed_at?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PhaseCreate {
  name: string;
  description?: string;
  order_index?: number;
  due_date?: string;
}

export interface PhaseUpdate {
  name?: string;
  description?: string;
  order_index?: number;
  is_completed?: boolean;
  due_date?: string;
}

// ==================== FEATURE TYPES ====================

export interface Feature {
  id: string;
  idea_id: string;
  phase_id?: string;
  title: string;
  description?: string;
  is_completed: boolean;
  completed_at?: string;
  priority: PriorityEnum;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface FeatureCreate {
  title: string;
  description?: string;
  priority?: PriorityEnum;
  order_index?: number;
}

export interface FeatureUpdate {
  title?: string
  description?: string
  is_completed?: boolean
  priority?: PriorityEnum
  order_index?: number
  phase_id?: string
}

// ==================== API HELPER ====================

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ==================== CATEGORIES API ====================

export class CategoryAPI {
  static async getCategories(): Promise<Category[]> {
    const result = await fetchWithAuth(`${API_URL}/api/categories`);
    return result.data.categories;
  }

  static async createCategory(data: CategoryCreate): Promise<Category> {
    const result = await fetchWithAuth(`${API_URL}/api/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data.category;
  }

  static async updateCategory(categoryId: string, data: CategoryUpdate): Promise<Category> {
    const result = await fetchWithAuth(`${API_URL}/api/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result.data.category;
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    await fetchWithAuth(`${API_URL}/api/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }
}

// ==================== IDEAS API ====================

export class IdeaAPI {
  static async getIdeas(params?: IdeaListParams): Promise<PaginatedIdeas> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const result = await fetchWithAuth(`${API_URL}/api/ideas?${queryParams}`);
    return result.data;
  }

  static async getIdea(ideaId: string): Promise<IdeaDetailResponse> {
    const result = await fetchWithAuth(`${API_URL}/api/ideas/${ideaId}`);
    return result.data;
  }

  static async createIdea(data: IdeaCreate): Promise<Idea> {
    const result = await fetchWithAuth(`${API_URL}/api/ideas`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data.idea;
  }

  static async updateIdea(ideaId: string, data: IdeaUpdate): Promise<Idea> {
    const result = await fetchWithAuth(`${API_URL}/api/ideas/${ideaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result.data.idea;
  }

  static async deleteIdea(ideaId: string): Promise<void> {
    await fetchWithAuth(`${API_URL}/api/ideas/${ideaId}`, {
      method: 'DELETE',
    });
  }
}

// ==================== RELATED IDEAS API ====================

export class RelatedIdeaAPI {
  static async createRelation(data: RelatedIdeaCreate): Promise<RelatedIdea> {
    const result = await fetchWithAuth(`${API_URL}/api/related-ideas`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data.relation;
  }

  static async getRelatedIdeas(ideaId: string): Promise<RelatedIdeaWithDetails[]> {
    const result = await fetchWithAuth(`${API_URL}/api/related-ideas/${ideaId}`);
    return result.data.related_ideas;
  }

  static async getIdeaGraph(ideaId: string, depth: number = 2): Promise<IdeaGraph> {
    const result = await fetchWithAuth(`${API_URL}/api/related-ideas/graph/${ideaId}?depth=${depth}`);
    return result.data.graph;
  }

  static async updateRelation(relationId: string, data: RelatedIdeaUpdate): Promise<RelatedIdea> {
    const result = await fetchWithAuth(`${API_URL}/api/related-ideas/${relationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result.data.relation;
  }

  static async deleteRelation(relationId: string): Promise<void> {
    await fetchWithAuth(`${API_URL}/api/related-ideas/${relationId}`, {
      method: 'DELETE',
    });
  }

  static async getRecommendations(
    ideaId: string,
    topN: number = 5,
    autoCreate: boolean = false
  ): Promise<RecommendationList> {
    const result = await fetchWithAuth(
      `${API_URL}/api/related-ideas/recommendations/${ideaId}?top_n=${topN}&auto_create=${autoCreate}`
    );
    return result.data;
  }
}

// ==================== PHASES API ====================

export class PhaseAPI {
  static async getPhases(ideaId: string): Promise<Phase[]> {
    const result = await fetchWithAuth(`${API_URL}/api/ideas/${ideaId}/phases`);
    return result.data.phases;
  }

  static async createPhase(ideaId: string, data: PhaseCreate): Promise<Phase> {
    const result = await fetchWithAuth(`${API_URL}/api/ideas/${ideaId}/phases`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data.phase;
  }

  static async updatePhase(phaseId: string, data: PhaseUpdate): Promise<Phase> {
    const result = await fetchWithAuth(`${API_URL}/api/phases/${phaseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result.data.phase;
  }

  static async deletePhase(phaseId: string): Promise<void> {
    await fetchWithAuth(`${API_URL}/api/phases/${phaseId}`, {
      method: 'DELETE',
    });
  }
}

// ==================== FEATURES API ====================

export class FeatureAPI {
  static async getFeatures(ideaId: string): Promise<Feature[]> {
    const result = await fetchWithAuth(`${API_URL}/api/ideas/${ideaId}/features`);
    return result.data.features;
  }

  static async createFeatureForIdea(ideaId: string, data: FeatureCreate): Promise<Feature> {
    const result = await fetchWithAuth(`${API_URL}/api/ideas/${ideaId}/features`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data.feature;
  }

  static async createFeatureForPhase(phaseId: string, data: FeatureCreate): Promise<Feature> {
    const result = await fetchWithAuth(`${API_URL}/api/phases/${phaseId}/features`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data.feature;
  }

  static async updateFeature(featureId: string, data: FeatureUpdate): Promise<Feature> {
    const result = await fetchWithAuth(`${API_URL}/api/features/${featureId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result.data.feature;
  }

  static async deleteFeature(featureId: string): Promise<void> {
    await fetchWithAuth(`${API_URL}/api/features/${featureId}`, {
      method: 'DELETE',
    });
  }
}

// ==================== COMPETITOR API ====================

export class CompetitorAPI {
  static async scrapeCompetitors(data: CompetitorScrapeRequest): Promise<any> {
    const result = await fetchWithAuth(`${API_URL}/api/competitor/scrape`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data;
  }

  static async getCompetitorResearch(ideaId: string): Promise<any> {
    const result = await fetchWithAuth(`${API_URL}/api/competitor/${ideaId}`);
    return result.data;
  }
}

// ==================== AI API ====================

export class AIAPI {
  static async generateSuggestions(data: AIGenerateRequest): Promise<AISuggestion> {
    const result = await fetchWithAuth(`${API_URL}/api/ai/suggest`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data.suggestion;
  }

  static async getSuggestions(ideaId: string): Promise<AISuggestion[]> {
    const result = await fetchWithAuth(`${API_URL}/api/ai/suggestions/${ideaId}`);
    return result.data.suggestions;
  }

  static async getQueryLogs(limit: number = 50): Promise<AIQueryLog[]> {
    const result = await fetchWithAuth(`${API_URL}/api/ai/logs?limit=${limit}`);
    return result.data.logs;
  }

  static async createFromSuggestion(data: CreateFromSuggestionRequest): Promise<CreateFromSuggestionResponse> {
    const result = await fetchWithAuth(`${API_URL}/api/ai/suggestions/create-item`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data;
  }
}