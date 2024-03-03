// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database

const supabaseUrl = 'https://droddfzggyjoihciughq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyb2RkZnpnZ3lqb2loY2l1Z2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzMjYyNDksImV4cCI6MjAyNDkwMjI0OX0.u0seQeKDxcNmc3UD-NIZ3t9DKxpYLsrexl4YQoqNcVw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
