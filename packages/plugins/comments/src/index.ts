export { CommentsPlugin } from './CommentsPlugin';
export type { Comment, CommentReply, SerializedRange } from './CommentsPlugin';
export {
  addCommentCommand,
  replyToComment,
  resolveComment,
  reopenComment,
  deleteComment,
  getAllComments,
  getCommentsForRange,
  updateCommentText,
  exportDocumentWithComments,
  highlightComment,
  validateComments
} from './CommentsPlugin';
export { CommentsPluginProvider } from './CommentsPluginProvider';
