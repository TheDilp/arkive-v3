import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  boardItemDisplayDialogProps,
  UpdateBoardInputs,
} from "../../../custom-types";
import { useGetBoards, useUpdateBoard } from "../../../utils/customHooks";
import { boardLayouts } from "../../../utils/utils";

type Props = {
  visible: boardItemDisplayDialogProps;
  setVisible: (visible: boardItemDisplayDialogProps) => void;
};

export default function BoardUpdateDialog({ visible, setVisible }: Props) {
  const { project_id } = useParams();
  const updateBoardMutation = useUpdateBoard(project_id as string);
  const boards = useGetBoards(project_id as string);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateBoardInputs>({
    defaultValues: {
      title: visible.title,
      parent: visible.parent === "0" ? undefined : visible.parent,
      layout: visible.layout,
    },
  });
  const onSubmit: SubmitHandler<UpdateBoardInputs> = (data) => {
    updateBoardMutation.mutate({
      id: visible.id,
      ...data,
    });
    setVisible({
      id: "",
      title: "",
      parent: "",
      folder: false,
      depth: 0,
      layout: "",
      show: false,
    });
  };

  return (
    <Dialog
      header={`Update Board ${visible.title}`}
      visible={visible.show}
      onHide={() =>
        setVisible({
          id: "",
          title: "",
          parent: "",
          folder: false,
          depth: 0,
          layout: "",
          show: false,
        })
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-content-center">
          <div className="w-8">
            <InputText
              placeholder="Board Title"
              className="w-full"
              {...register("title", { required: true, maxLength: 100 })}
            />
            {errors.title?.type === "required" && (
              <span className="py-1" style={{ color: "var(--red-500)" }}>
                <i className="pi pi-exclamation-triangle"></i>
                This field is required!
              </span>
            )}
          </div>

          <div className="w-8">
            <Controller
              name="parent"
              control={control}
              render={({ field }) => (
                <Dropdown
                  className="w-full"
                  placeholder="Board Folder"
                  optionLabel="title"
                  optionValue="id"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={
                    boards.data?.filter(
                      (board) => board.folder && board.id !== visible.id
                    ) || []
                  }
                />
              )}
            />
          </div>
          <div className="w-8">
            <Controller
              name="layout"
              control={control}
              render={({ field }) => (
                <Dropdown
                  className="w-full"
                  placeholder="Board Layout"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={boardLayouts}
                />
              )}
            />
          </div>

          <div className="w-full flex justify-content-end">
            <Button
              label="Update Board"
              className="p-button-success p-button-outlined mt-2"
              icon="pi pi-plus"
              iconPos="right"
              type="submit"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
