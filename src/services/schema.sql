-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.chat_conversations (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_profile_id bigint UNIQUE,
  last_message_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  active_intent_id integer,
  form_data jsonb,
  form_status text,
  CONSTRAINT chat_conversations_pkey PRIMARY KEY (id),
  CONSTRAINT chat_conversations_user_profile_id_fkey FOREIGN KEY (user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.chat_form_states (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  conversation_id bigint NOT NULL UNIQUE,
  intent_id bigint NOT NULL UNIQUE,
  form_status text,
  form_data jsonb NOT NULL,
  next_expected_field text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_form_states_pkey PRIMARY KEY (id),
  CONSTRAINT chat_form_states_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id)
);
CREATE TABLE public.chat_messages (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  conversation_id bigint,
  message text,
  message_metadata json,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  role USER-DEFINED,
  intent_id integer,
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id)
);
CREATE TABLE public.companies (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  company_type USER-DEFINED NOT NULL,
  contact_email character varying,
  phone character varying,
  address text,
  country character varying NOT NULL DEFAULT 'Philippines'::character varying,
  timezone character varying NOT NULL DEFAULT 'Asia/Manila'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by bigint,
  CONSTRAINT companies_pkey PRIMARY KEY (id),
  CONSTRAINT companies_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.company_farmers (
  company_id bigint NOT NULL,
  farmer_user_profile_id bigint NOT NULL,
  assigned_sales_rep_user_profile_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT company_farmers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT company_farmers_assigned_sales_rep_user_profile_id_fkey FOREIGN KEY (assigned_sales_rep_user_profile_id) REFERENCES public.user_profiles(id),
  CONSTRAINT company_farmers_farmer_user_profile_id_fkey FOREIGN KEY (farmer_user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.dealer_incidents (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  reported_by bigint,
  problem text,
  problem_type text,
  product_affected text,
  dealer_name text,
  location text,
  tag text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  description text,
  CONSTRAINT dealer_incidents_pkey PRIMARY KEY (id),
  CONSTRAINT dealer_issue_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.faq (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  question text,
  answer text,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  category text,
  updated_at timestamp with time zone,
  company_id bigint,
  CONSTRAINT faq_pkey PRIMARY KEY (id),
  CONSTRAINT faq_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.farm_performance_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  company_id bigint NOT NULL,
  user_profile_id bigint NOT NULL,
  average_weight_kg double precision,
  feed_conversion_ratio double precision,
  mortality_count bigint,
  eggs_per_day bigint,
  shell_quality_issues boolean,
  feed_intake_status USER-DEFINED,
  health_status USER-DEFINED,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  feed_intake_kg double precision,
  bags_used double precision,
  CONSTRAINT farm_performance_logs_pkey PRIMARY KEY (id),
  CONSTRAINT farm_performance_logs_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT farm_performance_logs_user_profile_id_fkey FOREIGN KEY (user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.farmer_feed_usage (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  farmer_user_profile_id bigint NOT NULL,
  feed_product_id bigint NOT NULL,
  confirmed_by_farmer boolean NOT NULL DEFAULT false,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT farmer_feed_usage_pkey PRIMARY KEY (id),
  CONSTRAINT farmer_feed_usage_farmer_user_profile_id_fkey FOREIGN KEY (farmer_user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.farmer_livestock (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  live_stock_type USER-DEFINED,
  quantity bigint NOT NULL DEFAULT '0'::bigint,
  farmer_user_profile_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT farmer_livestock_pkey PRIMARY KEY (id),
  CONSTRAINT farmer_livestock_farmer_user_profile_id_fkey FOREIGN KEY (farmer_user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.farmers (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  farm_name text,
  farm_type USER-DEFINED,
  location_province text,
  location_city text,
  location_barangay text,
  farm_size double precision,
  longitude double precision,
  latitude double precision,
  user_profile_id bigint NOT NULL,
  current_feed bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  days_on_feed text,
  location_region text,
  CONSTRAINT farmers_pkey PRIMARY KEY (id),
  CONSTRAINT farmers_user_profile_id_fkey FOREIGN KEY (user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.feed_calculation_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_profile_id bigint NOT NULL,
  number_of_animals bigint NOT NULL,
  feed_frequency bigint NOT NULL,
  bag_size_kg bigint NOT NULL,
  current_stock_bags bigint NOT NULL,
  bag_cost_php double precision NOT NULL,
  animal_type USER-DEFINED NOT NULL,
  feed_stage USER-DEFINED NOT NULL,
  daily_consumption_kg double precision NOT NULL,
  bags_needed_per_week double precision NOT NULL,
  cost_per_week_php double precision NOT NULL,
  reorder_point_days double precision NOT NULL,
  alert_level text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  weekly_consumption_kg double precision NOT NULL,
  CONSTRAINT feed_calculation_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.feed_growth_targets (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  company_id bigint,
  feed_product_id bigint,
  target_animal_type USER-DEFINED,
  target_weight_kg double precision DEFAULT '0'::double precision,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feed_growth_targets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.feed_products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  company_id bigint,
  name text,
  product_line text,
  category character varying,
  feed_stage USER-DEFINED,
  target_animal_type USER-DEFINED,
  age_range_start integer,
  age_range_end integer,
  product_format USER-DEFINED,
  is_medicated boolean,
  goal text,
  usp text,
  feeding_instructions text,
  notes text,
  is_active boolean,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  default_expected_fcr bigint NOT NULL DEFAULT '0'::bigint,
  CONSTRAINT feed_products_pkey PRIMARY KEY (id),
  CONSTRAINT products_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.feed_usage_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  farmer_user_profile_id bigint NOT NULL,
  feed_product_id bigint NOT NULL,
  start_date timestamp without time zone NOT NULL,
  end_date timestamp without time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT feed_usage_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.field_product_incidents (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  reported_by bigint,
  problem text,
  feed_name text,
  birds_affected bigint,
  age_of_birds text,
  location text,
  farm_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  tag text,
  updated_at timestamp with time zone,
  description text,
  CONSTRAINT field_product_incidents_pkey PRIMARY KEY (id),
  CONSTRAINT field_product_issue_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.health_incidents (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  farmer_user_profile_id bigint NOT NULL,
  incident_date text NOT NULL,
  incident_type USER-DEFINED NOT NULL,
  affected_count integer NOT NULL,
  symptoms text,
  suspected_cause text,
  requires_vet_visit boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  reported_by bigint,
  actions_taken text,
  feed_info text,
  CONSTRAINT health_incidents_pkey PRIMARY KEY (id),
  CONSTRAINT health_incidents_farmer_user_profile_id_fkey FOREIGN KEY (farmer_user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.roles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sales_goals (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  company_id bigint NOT NULL,
  target_amount numeric NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_by bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT sales_goals_pkey PRIMARY KEY (id),
  CONSTRAINT sales_goals_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id),
  CONSTRAINT sales_goals_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.sales_reports (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  reported_by bigint,
  sales_date timestamp with time zone,
  product_sold text,
  quantity bigint,
  location text,
  farm_name text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  description text,
  total double precision,
  problem boolean,
  sale_date date,
  CONSTRAINT sales_reports_pkey PRIMARY KEY (id),
  CONSTRAINT sales_report_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.sales_reps (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  territory text,
  quota_monthly double precision,
  employee_id text,
  user_profile_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sales_reps_pkey PRIMARY KEY (id),
  CONSTRAINT sales_reps_user_profile_id_fkey FOREIGN KEY (user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.transition_plans (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  farmer_user_profile_id bigint NOT NULL,
  feed_product_id bigint NOT NULL,
  suggested_by text,
  plan_json jsonb,
  status text NOT NULL DEFAULT 'pending'::text,
  confirmed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT transition_plans_pkey PRIMARY KEY (id),
  CONSTRAINT transition_plans_feed_product_id_fkey FOREIGN KEY (feed_product_id) REFERENCES public.feed_products(id),
  CONSTRAINT transition_plans_farmer_user_profile_id_fkey FOREIGN KEY (farmer_user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.user_profiles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  identity_id uuid NOT NULL,
  company_id bigint,
  first_name character varying,
  last_name character varying,
  mobile_number character varying,
  email character varying,
  profile_picture_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_identity_id_fkey FOREIGN KEY (identity_id) REFERENCES auth.users(id),
  CONSTRAINT user_profiles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.user_roles (
  user_profile_id bigint NOT NULL,
  role_id bigint NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
  CONSTRAINT user_roles_user_profile_id_fkey FOREIGN KEY (user_profile_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.visit_reports (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  reported_by bigint,
  visit_type text,
  visit_date timestamp with time zone,
  location text,
  farm_name text,
  purpose text,
  observations text,
  notes text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ticket_number text,
  CONSTRAINT visit_reports_pkey PRIMARY KEY (id),
  CONSTRAINT visit_report_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.user_profiles(id)
);