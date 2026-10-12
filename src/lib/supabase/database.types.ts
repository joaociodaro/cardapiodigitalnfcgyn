// Gerado por scripts/generate-db-types.ts — não editar manualmente.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "12" };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          after: Json | null;
          before: Json | null;
          created_at: string;
          establishment_id: string | null;
          id: number;
          ip: unknown | null;
          target_id: string | null;
          target_type: string | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          after?: Json | null;
          before?: Json | null;
          created_at?: string;
          establishment_id?: string | null;
          id?: number;
          ip?: unknown | null;
          target_id?: string | null;
          target_type?: string | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          after?: Json | null;
          before?: Json | null;
          created_at?: string;
          establishment_id?: string | null;
          id?: number;
          ip?: unknown | null;
          target_id?: string | null;
          target_type?: string | null;
        };
        Relationships: [
          { foreignKeyName: "audit_logs_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
        ];
      };
      coupons: {
        Row: {
          applies_to: Database["public"]["Enums"]["billing_type"] | null;
          code: string;
          created_at: string;
          description: string | null;
          discount_type: Database["public"]["Enums"]["discount_type"];
          discount_value: number;
          id: string;
          is_active: boolean;
          max_redemptions: number | null;
          plan_ids: string[] | null;
          redemptions: number;
          valid_from: string | null;
          valid_until: string | null;
        };
        Insert: {
          applies_to?: Database["public"]["Enums"]["billing_type"] | null;
          code: string;
          created_at?: string;
          description?: string | null;
          discount_type: Database["public"]["Enums"]["discount_type"];
          discount_value: number;
          id?: string;
          is_active?: boolean;
          max_redemptions?: number | null;
          plan_ids?: string[] | null;
          redemptions?: number;
          valid_from?: string | null;
          valid_until?: string | null;
        };
        Update: {
          applies_to?: Database["public"]["Enums"]["billing_type"] | null;
          code?: string;
          created_at?: string;
          description?: string | null;
          discount_type?: Database["public"]["Enums"]["discount_type"];
          discount_value?: number;
          id?: string;
          is_active?: boolean;
          max_redemptions?: number | null;
          plan_ids?: string[] | null;
          redemptions?: number;
          valid_from?: string | null;
          valid_until?: string | null;
        };
        Relationships: [
        ];
      };
      establishment_members: {
        Row: {
          created_at: string;
          establishment_id: string;
          role: Database["public"]["Enums"]["member_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          establishment_id: string;
          role?: Database["public"]["Enums"]["member_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          establishment_id?: string;
          role?: Database["public"]["Enums"]["member_role"];
          user_id?: string;
        };
        Relationships: [
          { foreignKeyName: "establishment_members_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
        ];
      };
      establishments: {
        Row: {
          address: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          extra_info: string | null;
          id: string;
          instagram: string | null;
          logo_url: string | null;
          name: string;
          opening_hours: Json;
          phone: string | null;
          social_links: Json;
          updated_at: string;
          whatsapp: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          extra_info?: string | null;
          id?: string;
          instagram?: string | null;
          logo_url?: string | null;
          name: string;
          opening_hours?: Json;
          phone?: string | null;
          social_links?: Json;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          extra_info?: string | null;
          id?: string;
          instagram?: string | null;
          logo_url?: string | null;
          name?: string;
          opening_hours?: Json;
          phone?: string | null;
          social_links?: Json;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Relationships: [
        ];
      };
      licenses: {
        Row: {
          created_at: string;
          establishment_id: string;
          granted_by: string | null;
          hosting_until: string | null;
          id: string;
          limits_override: Json | null;
          notes: string | null;
          plan_id: string;
          purchase_id: string | null;
          source: Database["public"]["Enums"]["license_source"];
          starts_at: string;
          status: Database["public"]["Enums"]["license_status"];
          subscription_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          establishment_id: string;
          granted_by?: string | null;
          hosting_until?: string | null;
          id?: string;
          limits_override?: Json | null;
          notes?: string | null;
          plan_id: string;
          purchase_id?: string | null;
          source: Database["public"]["Enums"]["license_source"];
          starts_at?: string;
          status?: Database["public"]["Enums"]["license_status"];
          subscription_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          establishment_id?: string;
          granted_by?: string | null;
          hosting_until?: string | null;
          id?: string;
          limits_override?: Json | null;
          notes?: string | null;
          plan_id?: string;
          purchase_id?: string | null;
          source?: Database["public"]["Enums"]["license_source"];
          starts_at?: string;
          status?: Database["public"]["Enums"]["license_status"];
          subscription_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "licenses_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
          { foreignKeyName: "licenses_plan_id_fkey"; columns: ["plan_id"]; isOneToOne: false; referencedRelation: "plans"; referencedColumns: ["id"] },
          { foreignKeyName: "licenses_purchase_id_fkey"; columns: ["purchase_id"]; isOneToOne: false; referencedRelation: "purchases"; referencedColumns: ["id"] },
          { foreignKeyName: "licenses_subscription_id_fkey"; columns: ["subscription_id"]; isOneToOne: false; referencedRelation: "subscriptions"; referencedColumns: ["id"] },
        ];
      };
      media_assets: {
        Row: {
          bucket: string;
          created_at: string;
          created_by: string | null;
          establishment_id: string;
          height: number | null;
          id: string;
          mime_type: string;
          path: string;
          size_bytes: number;
          width: number | null;
        };
        Insert: {
          bucket?: string;
          created_at?: string;
          created_by?: string | null;
          establishment_id: string;
          height?: number | null;
          id?: string;
          mime_type: string;
          path: string;
          size_bytes: number;
          width?: number | null;
        };
        Update: {
          bucket?: string;
          created_at?: string;
          created_by?: string | null;
          establishment_id?: string;
          height?: number | null;
          id?: string;
          mime_type?: string;
          path?: string;
          size_bytes?: number;
          width?: number | null;
        };
        Relationships: [
          { foreignKeyName: "media_assets_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
        ];
      };
      menu_categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_hidden: boolean;
          menu_id: string;
          name: string;
          position: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_hidden?: boolean;
          menu_id: string;
          name: string;
          position?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_hidden?: boolean;
          menu_id?: string;
          name?: string;
          position?: number;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "menu_categories_menu_id_fkey"; columns: ["menu_id"]; isOneToOne: false; referencedRelation: "menus"; referencedColumns: ["id"] },
        ];
      };
      menu_products: {
        Row: {
          allergens: string[] | null;
          category_id: string;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          ingredients: string[] | null;
          is_available: boolean;
          is_featured: boolean;
          menu_id: string;
          name: string;
          notes: string | null;
          position: number;
          price_cents: number;
          promo_price_cents: number | null;
          tags: string[] | null;
          updated_at: string;
        };
        Insert: {
          allergens?: string[] | null;
          category_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          ingredients?: string[] | null;
          is_available?: boolean;
          is_featured?: boolean;
          menu_id: string;
          name: string;
          notes?: string | null;
          position?: number;
          price_cents: number;
          promo_price_cents?: number | null;
          tags?: string[] | null;
          updated_at?: string;
        };
        Update: {
          allergens?: string[] | null;
          category_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          ingredients?: string[] | null;
          is_available?: boolean;
          is_featured?: boolean;
          menu_id?: string;
          name?: string;
          notes?: string | null;
          position?: number;
          price_cents?: number;
          promo_price_cents?: number | null;
          tags?: string[] | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "menu_products_category_id_fkey"; columns: ["category_id"]; isOneToOne: false; referencedRelation: "menu_categories"; referencedColumns: ["id"] },
          { foreignKeyName: "menu_products_menu_id_fkey"; columns: ["menu_id"]; isOneToOne: false; referencedRelation: "menus"; referencedColumns: ["id"] },
        ];
      };
      menu_slug_history: {
        Row: {
          menu_id: string;
          replaced_at: string;
          slug: string;
        };
        Insert: {
          menu_id: string;
          replaced_at?: string;
          slug: string;
        };
        Update: {
          menu_id?: string;
          replaced_at?: string;
          slug?: string;
        };
        Relationships: [
          { foreignKeyName: "menu_slug_history_menu_id_fkey"; columns: ["menu_id"]; isOneToOne: false; referencedRelation: "menus"; referencedColumns: ["id"] },
        ];
      };
      menu_templates: {
        Row: {
          created_at: string;
          default_theme: Json;
          demo_document: Json | null;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          preview_image_url: string | null;
          segment: string;
          slug: string;
          sort_order: number;
          tier: Database["public"]["Enums"]["template_tier"];
          updated_at: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          default_theme: Json;
          demo_document?: Json | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          preview_image_url?: string | null;
          segment: string;
          slug: string;
          sort_order?: number;
          tier?: Database["public"]["Enums"]["template_tier"];
          updated_at?: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          default_theme?: Json;
          demo_document?: Json | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          preview_image_url?: string | null;
          segment?: string;
          slug?: string;
          sort_order?: number;
          tier?: Database["public"]["Enums"]["template_tier"];
          updated_at?: string;
          version?: number;
        };
        Relationships: [
        ];
      };
      menu_themes: {
        Row: {
          menu_id: string;
          theme: Json;
          updated_at: string;
        };
        Insert: {
          menu_id: string;
          theme: Json;
          updated_at?: string;
        };
        Update: {
          menu_id?: string;
          theme?: Json;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "menu_themes_menu_id_fkey"; columns: ["menu_id"]; isOneToOne: false; referencedRelation: "menus"; referencedColumns: ["id"] },
        ];
      };
      menu_versions: {
        Row: {
          created_at: string;
          document: Json;
          id: string;
          menu_id: string;
          published_by: string | null;
          template_slug: string;
          theme: Json;
          version_number: number;
        };
        Insert: {
          created_at?: string;
          document: Json;
          id?: string;
          menu_id: string;
          published_by?: string | null;
          template_slug: string;
          theme: Json;
          version_number: number;
        };
        Update: {
          created_at?: string;
          document?: Json;
          id?: string;
          menu_id?: string;
          published_by?: string | null;
          template_slug?: string;
          theme?: Json;
          version_number?: number;
        };
        Relationships: [
          { foreignKeyName: "menu_versions_menu_id_fkey"; columns: ["menu_id"]; isOneToOne: false; referencedRelation: "menus"; referencedColumns: ["id"] },
        ];
      };
      menu_views: {
        Row: {
          device: string | null;
          id: number;
          menu_id: string;
          source: string | null;
          viewed_at: string;
          visitor_hash: string | null;
        };
        Insert: {
          device?: string | null;
          id?: number;
          menu_id: string;
          source?: string | null;
          viewed_at?: string;
          visitor_hash?: string | null;
        };
        Update: {
          device?: string | null;
          id?: number;
          menu_id?: string;
          source?: string | null;
          viewed_at?: string;
          visitor_hash?: string | null;
        };
        Relationships: [
          { foreignKeyName: "menu_views_menu_id_fkey"; columns: ["menu_id"]; isOneToOne: false; referencedRelation: "menus"; referencedColumns: ["id"] },
        ];
      };
      menu_views_daily: {
        Row: {
          day: string;
          menu_id: string;
          qr_views: number;
          unique_visitors: number;
          views: number;
        };
        Insert: {
          day: string;
          menu_id: string;
          qr_views?: number;
          unique_visitors?: number;
          views?: number;
        };
        Update: {
          day?: string;
          menu_id?: string;
          qr_views?: number;
          unique_visitors?: number;
          views?: number;
        };
        Relationships: [
          { foreignKeyName: "menu_views_daily_menu_id_fkey"; columns: ["menu_id"]; isOneToOne: false; referencedRelation: "menus"; referencedColumns: ["id"] },
        ];
      };
      menus: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          establishment_id: string;
          id: string;
          name: string;
          published_at: string | null;
          published_version_id: string | null;
          settings: Json;
          slug: string;
          status: Database["public"]["Enums"]["menu_status"];
          template_id: string;
          template_version: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          establishment_id: string;
          id?: string;
          name: string;
          published_at?: string | null;
          published_version_id?: string | null;
          settings?: Json;
          slug: string;
          status?: Database["public"]["Enums"]["menu_status"];
          template_id: string;
          template_version: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          establishment_id?: string;
          id?: string;
          name?: string;
          published_at?: string | null;
          published_version_id?: string | null;
          settings?: Json;
          slug?: string;
          status?: Database["public"]["Enums"]["menu_status"];
          template_id?: string;
          template_version?: number;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "menus_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
          { foreignKeyName: "menus_published_version_fk"; columns: ["published_version_id"]; isOneToOne: false; referencedRelation: "menu_versions"; referencedColumns: ["id"] },
          { foreignKeyName: "menus_template_id_fkey"; columns: ["template_id"]; isOneToOne: false; referencedRelation: "menu_templates"; referencedColumns: ["id"] },
        ];
      };
      payment_events: {
        Row: {
          error: string | null;
          event_id: string;
          event_type: string | null;
          id: number;
          payload: Json;
          processed_at: string | null;
          provider: string;
          received_at: string;
          resource_id: string | null;
          signature_valid: boolean;
        };
        Insert: {
          error?: string | null;
          event_id: string;
          event_type?: string | null;
          id?: number;
          payload: Json;
          processed_at?: string | null;
          provider: string;
          received_at?: string;
          resource_id?: string | null;
          signature_valid: boolean;
        };
        Update: {
          error?: string | null;
          event_id?: string;
          event_type?: string | null;
          id?: number;
          payload?: Json;
          processed_at?: string | null;
          provider?: string;
          received_at?: string;
          resource_id?: string | null;
          signature_valid?: boolean;
        };
        Relationships: [
        ];
      };
      payments: {
        Row: {
          amount_cents: number;
          created_at: string;
          establishment_id: string | null;
          id: string;
          method: string | null;
          paid_at: string | null;
          provider: string;
          provider_payment_id: string;
          purchase_id: string | null;
          raw: Json | null;
          refunded_cents: number;
          status: Database["public"]["Enums"]["payment_status"];
          status_detail: string | null;
          subscription_id: string | null;
          updated_at: string;
        };
        Insert: {
          amount_cents: number;
          created_at?: string;
          establishment_id?: string | null;
          id?: string;
          method?: string | null;
          paid_at?: string | null;
          provider?: string;
          provider_payment_id: string;
          purchase_id?: string | null;
          raw?: Json | null;
          refunded_cents?: number;
          status: Database["public"]["Enums"]["payment_status"];
          status_detail?: string | null;
          subscription_id?: string | null;
          updated_at?: string;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          establishment_id?: string | null;
          id?: string;
          method?: string | null;
          paid_at?: string | null;
          provider?: string;
          provider_payment_id?: string;
          purchase_id?: string | null;
          raw?: Json | null;
          refunded_cents?: number;
          status?: Database["public"]["Enums"]["payment_status"];
          status_detail?: string | null;
          subscription_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "payments_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
          { foreignKeyName: "payments_purchase_id_fkey"; columns: ["purchase_id"]; isOneToOne: false; referencedRelation: "purchases"; referencedColumns: ["id"] },
          { foreignKeyName: "payments_subscription_id_fkey"; columns: ["subscription_id"]; isOneToOne: false; referencedRelation: "subscriptions"; referencedColumns: ["id"] },
        ];
      };
      permissions: {
        Row: {
          code: string;
          description: string | null;
          id: number;
        };
        Insert: {
          code: string;
          description?: string | null;
          id?: number;
        };
        Update: {
          code?: string;
          description?: string | null;
          id?: number;
        };
        Relationships: [
        ];
      };
      plans: {
        Row: {
          code: string;
          created_at: string;
          description: string | null;
          features: Json;
          hosting_renewal_price_cents: number | null;
          id: string;
          is_active: boolean;
          max_essential_templates: number | null;
          max_published_menus: number;
          monthly_price_cents: number | null;
          name: string;
          one_time_hosting_months: number;
          one_time_price_cents: number | null;
          provider_plan_ids: Json;
          sort_order: number;
          template_tier: Database["public"]["Enums"]["template_tier"];
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          description?: string | null;
          features?: Json;
          hosting_renewal_price_cents?: number | null;
          id?: string;
          is_active?: boolean;
          max_essential_templates?: number | null;
          max_published_menus?: number;
          monthly_price_cents?: number | null;
          name: string;
          one_time_hosting_months?: number;
          one_time_price_cents?: number | null;
          provider_plan_ids?: Json;
          sort_order?: number;
          template_tier?: Database["public"]["Enums"]["template_tier"];
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string | null;
          features?: Json;
          hosting_renewal_price_cents?: number | null;
          id?: string;
          is_active?: boolean;
          max_essential_templates?: number | null;
          max_published_menus?: number;
          monthly_price_cents?: number | null;
          name?: string;
          one_time_hosting_months?: number;
          one_time_price_cents?: number | null;
          provider_plan_ids?: Json;
          sort_order?: number;
          template_tier?: Database["public"]["Enums"]["template_tier"];
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      platform_settings: {
        Row: {
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [
        ];
      };
      product_addons: {
        Row: {
          id: string;
          name: string;
          position: number;
          price_cents: number;
          product_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          position?: number;
          price_cents: number;
          product_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: number;
          price_cents?: number;
          product_id?: string;
        };
        Relationships: [
          { foreignKeyName: "product_addons_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "menu_products"; referencedColumns: ["id"] },
        ];
      };
      product_variations: {
        Row: {
          id: string;
          name: string;
          position: number;
          price_cents: number;
          product_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          position?: number;
          price_cents: number;
          product_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: number;
          price_cents?: number;
          product_id?: string;
        };
        Relationships: [
          { foreignKeyName: "product_variations_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "menu_products"; referencedColumns: ["id"] },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          blocked_at: string | null;
          created_at: string;
          deleted_at: string | null;
          full_name: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          blocked_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          blocked_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      purchases: {
        Row: {
          amount_cents: number;
          coupon_id: string | null;
          created_at: string;
          establishment_id: string;
          id: string;
          kind: string;
          plan_id: string;
          provider: string;
          provider_preference_id: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          updated_at: string;
        };
        Insert: {
          amount_cents: number;
          coupon_id?: string | null;
          created_at?: string;
          establishment_id: string;
          id?: string;
          kind?: string;
          plan_id: string;
          provider?: string;
          provider_preference_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          updated_at?: string;
        };
        Update: {
          amount_cents?: number;
          coupon_id?: string | null;
          created_at?: string;
          establishment_id?: string;
          id?: string;
          kind?: string;
          plan_id?: string;
          provider?: string;
          provider_preference_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "purchases_coupon_id_fkey"; columns: ["coupon_id"]; isOneToOne: false; referencedRelation: "coupons"; referencedColumns: ["id"] },
          { foreignKeyName: "purchases_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
          { foreignKeyName: "purchases_plan_id_fkey"; columns: ["plan_id"]; isOneToOne: false; referencedRelation: "plans"; referencedColumns: ["id"] },
        ];
      };
      qr_codes: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          menu_id: string;
          scans: number;
          style: Json;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          menu_id: string;
          scans?: number;
          style?: Json;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          menu_id?: string;
          scans?: number;
          style?: Json;
        };
        Relationships: [
          { foreignKeyName: "qr_codes_menu_id_fkey"; columns: ["menu_id"]; isOneToOne: false; referencedRelation: "menus"; referencedColumns: ["id"] },
        ];
      };
      role_permissions: {
        Row: {
          permission_id: number;
          role_id: number;
        };
        Insert: {
          permission_id: number;
          role_id: number;
        };
        Update: {
          permission_id?: number;
          role_id?: number;
        };
        Relationships: [
          { foreignKeyName: "role_permissions_permission_id_fkey"; columns: ["permission_id"]; isOneToOne: false; referencedRelation: "permissions"; referencedColumns: ["id"] },
          { foreignKeyName: "role_permissions_role_id_fkey"; columns: ["role_id"]; isOneToOne: false; referencedRelation: "roles"; referencedColumns: ["id"] },
        ];
      };
      roles: {
        Row: {
          code: string;
          description: string | null;
          id: number;
        };
        Insert: {
          code: string;
          description?: string | null;
          id?: number;
        };
        Update: {
          code?: string;
          description?: string | null;
          id?: number;
        };
        Relationships: [
        ];
      };
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          coupon_id: string | null;
          created_at: string;
          current_period_end: string | null;
          current_period_start: string | null;
          establishment_id: string;
          grace_until: string | null;
          id: string;
          plan_id: string;
          price_cents: number;
          provider: string;
          provider_subscription_id: string | null;
          status: Database["public"]["Enums"]["subscription_status"];
          updated_at: string;
        };
        Insert: {
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          coupon_id?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          establishment_id: string;
          grace_until?: string | null;
          id?: string;
          plan_id: string;
          price_cents: number;
          provider?: string;
          provider_subscription_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          updated_at?: string;
        };
        Update: {
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          coupon_id?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          establishment_id?: string;
          grace_until?: string | null;
          id?: string;
          plan_id?: string;
          price_cents?: number;
          provider?: string;
          provider_subscription_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "subscriptions_coupon_id_fkey"; columns: ["coupon_id"]; isOneToOne: false; referencedRelation: "coupons"; referencedColumns: ["id"] },
          { foreignKeyName: "subscriptions_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
          { foreignKeyName: "subscriptions_plan_id_fkey"; columns: ["plan_id"]; isOneToOne: false; referencedRelation: "plans"; referencedColumns: ["id"] },
        ];
      };
      support_requests: {
        Row: {
          created_at: string;
          email: string;
          establishment_id: string | null;
          id: string;
          message: string;
          name: string;
          status: Database["public"]["Enums"]["support_status"];
          subject: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          establishment_id?: string | null;
          id?: string;
          message: string;
          name: string;
          status?: Database["public"]["Enums"]["support_status"];
          subject: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          establishment_id?: string | null;
          id?: string;
          message?: string;
          name?: string;
          status?: Database["public"]["Enums"]["support_status"];
          subject?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          { foreignKeyName: "support_requests_establishment_id_fkey"; columns: ["establishment_id"]; isOneToOne: false; referencedRelation: "establishments"; referencedColumns: ["id"] },
        ];
      };
      user_roles: {
        Row: {
          granted_at: string;
          granted_by: string | null;
          role_id: number;
          user_id: string;
        };
        Insert: {
          granted_at?: string;
          granted_by?: string | null;
          role_id: number;
          user_id: string;
        };
        Update: {
          granted_at?: string;
          granted_by?: string | null;
          role_id?: number;
          user_id?: string;
        };
        Relationships: [
          { foreignKeyName: "user_roles_role_id_fkey"; columns: ["role_id"]; isOneToOne: false; referencedRelation: "roles"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      create_establishment: { Args: { p_name: string; p_whatsapp?: string; p_phone?: string }; Returns: string };
      establishment_has_hosting: { Args: { est: string }; Returns: boolean };
      get_published_menu: { Args: { p_slug: string }; Returns: { menu_id: string; slug: string; template_slug: string; document: Json; theme: Json; available: boolean; redirect_to: string }[] };
      is_member: { Args: { est: string; uid?: string }; Returns: boolean };
      is_platform_admin: { Args: { uid?: string }; Returns: boolean };
      member_role_of: { Args: { est: string; uid?: string }; Returns: Database["public"]["Enums"]["member_role"] };
      request_account_deletion: { Args: never; Returns: undefined };
    };
    Enums: {
      billing_type: "subscription" | "one_time";
      discount_type: "percent" | "fixed";
      license_source: "purchase" | "subscription" | "admin_grant";
      license_status: "active" | "expired" | "revoked";
      member_role: "owner" | "manager" | "editor";
      menu_status: "draft" | "published" | "unpublished" | "suspended";
      payment_status: "pending" | "approved" | "rejected" | "refunded" | "charged_back" | "canceled" | "in_process";
      subscription_status: "pending" | "active" | "past_due" | "suspended" | "canceled" | "expired";
      support_status: "open" | "in_progress" | "resolved" | "closed";
      template_tier: "essential" | "premium";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];
