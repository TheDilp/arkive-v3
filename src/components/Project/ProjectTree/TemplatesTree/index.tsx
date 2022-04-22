import { useParams } from "react-router-dom";
import { useGetTemplates } from "../../../../utils/customHooks";

type Props = {
  setDocId: (docId: string) => void;
};

export default function TemplatesTree({ setDocId }: Props) {
  const { project_id } = useParams();
  const templates = useGetTemplates(project_id as string);
  return (
    <div>
      <ul>
        {templates &&
          templates.map((template) => (
            <li
              key={template.id}
              onClick={() => {
                setDocId(template.id);
              }}
            >
              {template.title}
            </li>
          ))}
      </ul>
    </div>
  );
}
