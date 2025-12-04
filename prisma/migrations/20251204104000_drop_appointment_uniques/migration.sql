-- Drop unique constraints that prevented rebooking cancelled slots
DROP INDEX IF EXISTS "appointments_doctor_id_date_key";
DROP INDEX IF EXISTS "appointments_patient_id_date_key";
