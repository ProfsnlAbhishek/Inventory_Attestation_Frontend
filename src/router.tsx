import {createBrowserRouter, RouterProvider} from "react-router-dom";

import AppShell from "./components/Layout/AppShell";
import Inventory from "./features/inventory/pages/Inventory";





const router = createBrowserRouter([
    {
        path:"/",
        element: <AppShell />,
        children: [
            {
                index: true,
                element: <Inventory/>
            }
        ],

       
    },

  
], 
// {basename: "Inventory_Attestation"},
);
export default function AppRouter(){
    return <RouterProvider router={router} />
}