import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../components/auth/authSlice';
import auditReducer from '../features/audit/auditSlice';
import schoolReducer from '../school/schoolSlice';



const store = configureStore( {
    reducer: {
        auth: authReducer,
        school: schoolReducer,
        audit: auditReducer,
    }
});
export default store;