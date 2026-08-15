// Stub generated from HC-INVESTORS schema (section 4 of project brief).
// Regenerate when schema changes:
//   SUPABASE_ACCESS_TOKEN=<token> pnpm dlx supabase@latest gen types typescript \
//     --project-id edsyoxqsnsxfftnbsjgq > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: string;
          status: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: string;
          status?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: string;
          status?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      investors: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string | null;
          total_investment: number;
          is_active: boolean;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          commission_rate: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name?: string | null;
          total_investment?: number;
          is_active?: boolean;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          commission_rate?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          company_name?: string | null;
          total_investment?: number;
          is_active?: boolean;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          commission_rate?: number | null;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      cars: {
        Row: {
          id: number;
          plate_number: string;
          investor_id: string | null;
          model_group_id: number | null;
          vehicle_id: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          plate_number: string;
          investor_id?: string | null;
          model_group_id?: number | null;
          vehicle_id?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          plate_number?: string;
          investor_id?: string | null;
          model_group_id?: number | null;
          vehicle_id?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      model_group: {
        Row: {
          id: number;
          name: string | null;
          brand: string | null;
          model: string | null;
          transmission: string | null;
          fuel: string | null;
          seats: number | null;
          luggage: number | null;
          category: string | null;
          daily_km: number | null;
          monthly_km: number | null;
          deposit: number | null;
          price: number | null;
          image_url: string | null;
          total_cars: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          brand?: string | null;
          model?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          brand?: string | null;
          model?: string | null;
          image_url?: string | null;
        };
        Relationships: GenericRelationship[];
      };
      bookings: {
        Row: {
          id: number;
          car_id: number;
          customer_id: string;
          start_date: string;
          end_date: string;
          status: string;
          is_currently_active: boolean;
          booking_number: string | null;
          insurance_type: string | null;
          additional_services: Json | null;
          km_at_delivery: number | null;
          fuel_at_delivery: string | null;
          kabis_reported: boolean;
          invoice_issued: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          car_id: number;
          customer_id: string;
          start_date: string;
          end_date: string;
          status?: string;
          is_currently_active?: boolean;
          booking_number?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          car_id?: number;
          status?: string;
          is_currently_active?: boolean;
        };
        Relationships: GenericRelationship[];
      };
      financial_transactions: {
        Row: {
          id: number;
          investor_id: string;
          month_key: string;
          sheet_type: string | null;
          car_id: number | null;
          category: string;
          amount: number;
          direction: string;
          date: string;
          note: string | null;
          created_at: string;
          receipt_url: string | null;
        };
        Insert: {
          id?: number;
          investor_id: string;
          month_key: string;
          sheet_type?: string | null;
          car_id?: number | null;
          category?: string;
          amount: number;
          direction: string;
          date: string;
          note?: string | null;
          created_at?: string;
          receipt_url?: string | null;
        };
        Update: {
          id?: number;
          investor_id?: string;
          month_key?: string;
          car_id?: number | null;
          category?: string;
          amount?: number;
          direction?: string;
          date?: string;
          note?: string | null;
          receipt_url?: string | null;
        };
        Relationships: GenericRelationship[];
      };
      car_photos: {
        Row: {
          id: number;
          car_id: number;
          file_path: string;
          is_primary: boolean;
          sort_order: number;
        };
        Insert: {
          id?: number;
          car_id: number;
          file_path: string;
          is_primary?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: number;
          car_id?: number;
          file_path?: string;
          is_primary?: boolean;
          sort_order?: number;
        };
        Relationships: GenericRelationship[];
      };
      cars_registration: {
        Row: {
          id: string;
          car_id: number | null;
          manufacture_year: number | null;
          car_package: string | null;
          kasko: string | null;
          insurance_expiry: string | null;
          inspection_expiry: string | null;
          purchase_date: string | null;
          ruhsat_url: string | null;
          insurance_file_url: string | null;
          purchase_invoice_url: string | null;
          purchase_contract_url: string | null;
        };
        Insert: {
          id?: string;
          car_id?: number | null;
          manufacture_year?: number | null;
        };
        Update: {
          id?: string;
          car_id?: number | null;
        };
        Relationships: GenericRelationship[];
      };
    };
    Views: {
      car_availability: {
        Row: {
          id: number;
          investor_id: string;
          status: string;
          availability: boolean;
        };
        Relationships: GenericRelationship[];
      };
      investor_model_counts: {
        Row: Record<string, unknown>;
        Relationships: GenericRelationship[];
      };
      v_car_primary_photo: {
        Row: {
          car_id: number;
          file_path: string;
        };
        Relationships: GenericRelationship[];
      };
      active_bookings: {
        Row: {
          id: number;
          car_id: number;
          start_date: string;
          end_date: string;
          status: string;
          is_currently_active: boolean;
        };
        Relationships: GenericRelationship[];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      user_role: "customer" | "admin" | "investor";
      booking_status: "pending" | "active" | "completed" | "cancelled";
      direction: "IN" | "OUT";
    };
    CompositeTypes: Record<string, never>;
  };
};
