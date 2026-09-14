import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Eye, Pencil, Trash2, Loader2 } from "lucide-react";

import { useResume } from "../context/ResumeContext";

import PageHeader from "../components/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { EmptyState } from "../components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { fadeUp, staggerContainer } from "../lib/motion";

const Dropzone = ({ onFile, uploading }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`cursor-pointer rounded-[22px] border border-dashed p-8 text-center transition-colors sm:p-[52px] ${
        isDragging ? "border-brand-500 bg-surface-sunken" : "border-border-strong bg-elevated hover:bg-surface-sunken"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />

      <motion.div
        animate={isDragging ? { y: -4, scale: 1.05 } : { y: [0, -6, 0] }}
        transition={isDragging ? { duration: 0.2 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-sunken text-fg-muted"
      >
        {uploading ? <Loader2 size={26} className="animate-spin" /> : <Upload size={26} />}
      </motion.div>

      <p
        className="mt-4 font-medium text-fg"
        style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "-0.022em" }}
      >
        {uploading ? "Uploading resume…" : "Drag & drop your resume"}
      </p>
      <p className="mt-1.5 text-sm text-fg-muted">or click to browse — PDF only, up to 5 MB</p>
    </div>
  );
};

const ResumeCard = ({
  resume,
  isRenaming,
  newName,
  onNewNameChange,
  onStartRename,
  onSaveRename,
  onCancelRename,
  onPreview,
  onDeleteRequest,
}) => (
  <motion.div variants={fadeUp}>
    <Card className="transition-transform hover:-translate-y-1">
      <CardContent className="p-[22px]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] bg-surface-sunken text-fg-muted">
            <FileText size={16} />
          </div>

          <Badge variant="outline">PDF</Badge>
        </div>

        {isRenaming ? (
          <div className="space-y-3">
            <Input value={newName} onChange={(e) => onNewNameChange(e.target.value)} autoFocus />

            <div className="flex gap-2">
              <Button size="sm" onClick={onSaveRename}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelRename}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="line-clamp-2 text-base font-medium text-fg">{resume.originalName}</h2>

            <p className="mt-2 text-sm text-fg-muted">{(resume.fileSize / 1024).toFixed(1)} KB</p>
            <p className="mt-1 text-xs text-fg-subtle" style={{ fontFamily: "var(--font-mono)" }}>
              Uploaded {new Date(resume.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-5 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={onPreview}>
                <Eye size={15} />
                Preview
              </Button>
              <Button size="sm" variant="secondary" className="flex-1" onClick={onStartRename}>
                <Pencil size={15} />
                Rename
              </Button>
              <Button size="sm" variant="destructive" onClick={onDeleteRequest}>
                <Trash2 size={15} />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const Resumes = () => {
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { resumes, resumeLoading, uploadResume, previewResume, renameResume, deleteResume } =
    useResume();

  const startRename = (resume) => {
    setRenamingId(resume._id);
    setNewName(resume.originalName);
  };

  const handleRename = async (resumeId) => {
    const updated = await renameResume(resumeId, newName);

    if (updated) {
      setRenamingId(null);
      setNewName("");
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    const deleted = await deleteResume(deleteTarget._id);
    setDeleting(false);

    if (deleted) setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Resumes"
        title="Manage your resumes"
        sub="Upload every version you own, preview and rename them, and let EmlyAI choose the best one for each posting."
      />

      <Dropzone onFile={uploadResume} uploading={resumeLoading} />

      {resumes.length === 0 && !resumeLoading ? (
        <EmptyState
          icon={FileText}
          title="No resumes uploaded yet"
          description="Upload your first PDF resume to start AI analysis, best resume selection, and one-click applications."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.06)}
          className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              isRenaming={renamingId === resume._id}
              newName={newName}
              onNewNameChange={setNewName}
              onStartRename={() => startRename(resume)}
              onSaveRename={() => handleRename(resume._id)}
              onCancelRename={() => {
                setRenamingId(null);
                setNewName("");
              }}
              onPreview={() => previewResume(resume._id)}
              onDeleteRequest={() => setDeleteTarget(resume)}
            />
          ))}
        </motion.div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <Trash2 size={24} />
          </div>

          <DialogTitle>Delete resume?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-fg">{deleteTarget?.originalName}</span>? This action
            cannot be undone.
          </DialogDescription>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" loading={deleting} onClick={handleConfirmDelete}>
              Delete Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resumes;
