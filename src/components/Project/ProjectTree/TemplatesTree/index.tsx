import { useParams } from "react-router-dom";
import { useGetTemplates } from "../../../../utils/customHooks";

type Props = {};

export default function TemplatesTree({}: Props) {
  const { project_id } = useParams();
  const templates = useGetTemplates(project_id as string);
  console.log(templates);
  return (
    <div>
      <ul>
        {templates &&
          templates.map((template) => (
            <li key={template.id}> {template.title} </li>
          ))}
      </ul>
    </div>
  );
}
