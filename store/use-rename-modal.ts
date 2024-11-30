import { create } from "zustand";

const defaultValues = { id: "", name: "", subDomain: "", favicon: "" };

interface IRenameModal {
  isOpen: boolean;
  initialValues: typeof defaultValues;
  onOpen: (
    id: string,
    name: string,
    subDomain: string,
    favicon: string
  ) => void;
  onClose: () => void;
}

export const useRenameModal = create<IRenameModal>((set) => ({
  isOpen: false,
  initialValues: defaultValues,
  onOpen: (id, name, subDomain, favicon) =>
    set({
      isOpen: true,
      initialValues: { id, name, subDomain, favicon },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
}));
