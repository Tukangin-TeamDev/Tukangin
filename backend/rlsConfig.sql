-- Enable RLS on all tables in the public schema
DO $$ 
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_record.tablename);
        RAISE NOTICE 'Enabled RLS on table: %', table_record.tablename;
    END LOOP;
END $$;

-- Create default policies for authenticated users to see their own data
DO $$ 
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
    LOOP
        -- Check if the table has a user_id column
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = table_record.tablename
              AND column_name = 'user_id'
        ) THEN
            -- Create a policy for user data (only if policy doesn't exist)
            IF NOT EXISTS (
                SELECT 1
                FROM pg_policies 
                WHERE tablename = table_record.tablename
                AND policyname = table_record.tablename || '_user_policy'
            ) THEN
                EXECUTE format('
                    CREATE POLICY "%1$s_user_policy" ON public.%1$I
                    FOR ALL
                    USING (auth.uid() = user_id)
                    WITH CHECK (auth.uid() = user_id);
                ', table_record.tablename);
                
                RAISE NOTICE 'Created user policy for table: %', table_record.tablename;
            END IF;
        END IF;
    END LOOP;
END $$;

-- Create a simple default policy for authenticated users to access all data
DO $$ 
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
    LOOP
        -- Create a basic auth policy (only if no user_id column and no policy exists)
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = table_record.tablename
              AND column_name = 'user_id'
        ) AND NOT EXISTS (
            SELECT 1
            FROM pg_policies 
            WHERE tablename = table_record.tablename
        ) THEN
            EXECUTE format('
                CREATE POLICY "%1$s_auth_policy" ON public.%1$I
                FOR ALL
                USING (auth.role() = ''authenticated'')
                WITH CHECK (auth.role() = ''authenticated'');
            ', table_record.tablename);
            
            RAISE NOTICE 'Created authenticated access policy for table: %', table_record.tablename;
        END IF;
    END LOOP;
END $$;

-- Create a policy for service role access to all tables
-- This helps prevent lockout when using the service role
DO $$ 
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
    LOOP
        -- Create service role policy (only if policy doesn't exist)
        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies 
            WHERE tablename = table_record.tablename
            AND policyname = table_record.tablename || '_service_role_policy'
        ) THEN
            EXECUTE format('
                CREATE POLICY "%1$s_service_role_policy" ON public.%1$I
                FOR ALL
                USING (auth.jwt() ->> ''role'' = ''service_role'')
                WITH CHECK (auth.jwt() ->> ''role'' = ''service_role'');
            ', table_record.tablename);
            
            RAISE NOTICE 'Created service role policy for table: %', table_record.tablename;
        END IF;
    END LOOP;
END $$;

-- Add a policy for public read access (if needed)
-- Uncomment and modify this section if you want some tables to be publicly readable
/*
DO $$ 
DECLARE
    public_tables TEXT[] := ARRAY['products', 'categories', 'posts']; -- Add your public tables here
    t TEXT;
BEGIN
    FOREACH t IN ARRAY public_tables
    LOOP
        EXECUTE format('
            CREATE POLICY "%1$s_public_read" ON public.%1$I
            FOR SELECT
            USING (true);
        ', t);
        
        RAISE NOTICE 'Created public read policy for table: %', t;
    END LOOP;
END $$;
*/