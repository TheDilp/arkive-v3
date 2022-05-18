import { DataViewLayoutOptions } from "primereact/dataview";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../utils/supabaseUtils";

type Props = {
  refetch: any;
  filter: string;
  layout: string;
  setFilter: (filter: string) => void;
  setLayout: (layout: string) => void;
};

export default function FileBrowserHeader({
  refetch,
  filter,
  layout,
  setFilter,
  setLayout,
}: Props) {
  const { project_id } = useParams();
  return (
    <div className="w-10 mb-2 flex">
      <div className="w-6 flex flex-wrap align-content-top align-items-center">
        <FileUpload
          mode="basic"
          name="demo[]"
          accept="image/*"
          maxFileSize={1000000}
          multiple
          auto
          customUpload
          uploadHandler={async (e) => {
            let files = e.files;
            for (let i = 0; i < files.length; i++) {
              await uploadImage(project_id as string, files[i]);
            }
            refetch();
            e.options.clear();
          }}
        />
        <InputText
          placeholder="Search by title"
          className="ml-2 h-min"
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="w-6 flex justify-content-end">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    </div>
  );
}
