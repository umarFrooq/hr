import { useSelector } from "react-redux";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/store/api/usersApi";
import { toast } from "@/hooks/use-toast";

export function useUserProfile() {
  const { user } = useSelector((state) => state.auth);
  const {
    data: profile,
    isLoading,
    isError,
  } = useGetUserByIdQuery(user?.id, {
    skip: !user?.id,
  });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  async function saveProfile(profileData) {
    try {
      const res = await updateUser({ id: user.id, ...profileData }).unwrap();
      toast({ title: "Profile updated" });
      return { data: res };
    } catch (err) {
      const description =
        typeof err.data?.message === "string"
          ? err.data.message
          : "Unknown error";
      toast({
        title: "Failed to save profile",
        description,
        variant: "destructive",
      });
      return { error: err.data?.message };
    }
  }

  return {
    profile,
    saveProfile,
    loading: isLoading || isUpdating,
    isError,
  };
}
