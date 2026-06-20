import { TagStateScreen } from "@/components/public-profile/tag-state-screen";

export default function NotFound() {
  return (
    <TagStateScreen
      title="Médaille introuvable"
      description="Le code de cette médaille n'existe pas dans notre système. Vérifiez l'adresse ou contactez le support."
    />
  );
}
