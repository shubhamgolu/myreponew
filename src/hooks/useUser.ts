 
"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/editor";
import { isAuthenticated } from "@/lib/editor/auth";
import { toast } from "sonner";
    
export const useUser = (initialData?: {
  user: User | null;
  errCode: number | null; 
}) => {   
                                                                                                  
  const client = useQueryClient();
  const  { data: { user, errCode } = { user: null, errCode: null }, isLoading } =
    useQuery({
      queryKey: ["user.me"],   
        
      queryFn: async () => {
        const authResult = await isAuthenticated();
        if (authResult && "id" in authResult) {
          return { user: authResult as User, errCode: null };
        }
                                                                                                                                                                                                                             
        return { user: null, errCode: 401 };
      },  
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
      initialData: initialData    
        ? { user: initialData?.user, errCode: initialData?.errCode }
           : undefined,
      enabled: true, // Enable the query to fetch the mock user
    });
                                                                                                                                                                                                  
  const logout = async () => {
    // Since authe  ntication is removed, just reload the page
    toast.success("Logout successful");
    client.setQueryData(["user.me"], {
      user: null,
      errCode: null,
    });
    window.location.reload();
  };
    
  return {
    user,
    errCode,
    loading: isLoading,
    logout,            
  };
};





                                                                              
  
         

                                                
                                                


            



   
              





   
                                              
                                                         
               
                                    
    
       
                                                                                                       