import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SavedProvider } from "./contexts/SavedContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { AppDetailPage } from "./pages/AppDetailPage";
import { ComparePage } from "./pages/ComparePage";
import { SavedPage } from "./pages/SavedPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "app/:slug", element: <AppDetailPage /> },
      { path: "compare", element: <ComparePage /> },
      { path: "saved", element: <SavedPage /> },
    ],
  },
]);

export default function App() {
  return (
    <SavedProvider>
      <RouterProvider router={router} />
    </SavedProvider>
  );
}