import PageHeader from "../components/PageHeader";
import EmlyChatPanel from "../components/EmlyChatPanel";

const EmlyChat = () => {
  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-6">
      <PageHeader eyebrow="EmlyAI Chat" title="Ask EmlyAI" sub="Resumes, job descriptions, interview prep — ask anything." />
      <EmlyChatPanel className="flex-1" />
    </div>
  );
};

export default EmlyChat;
