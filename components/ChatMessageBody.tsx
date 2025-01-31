import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import {Twemoji} from 'react-emoji-render';
import {Box, Image} from 'theme-ui';
import {Attachment} from '../helpers/types';

const renderers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text: (props: any) => {
    return <Twemoji text={props.children} />;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} style={{maxWidth: '100%', maxHeight: 400}} />;
  },
};

const ChatMessageAttachment = ({attachment}: {attachment: Attachment}) => {
  const {
    id,
    filename,
    file_url: fileUrl,
    content_type: contentType,
  } = attachment;
  const isImageFile = contentType.indexOf('image') !== -1;

  return (
    <Box key={id} mb={1}>
      <a
        href={fileUrl}
        style={{
          textDecoration: 'underline',
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {isImageFile && false ? (
          <Box>
            <Image alt={filename} src={fileUrl} />
          </Box>
        ) : (
          filename
        )}
      </a>
    </Box>
  );
};

type ChatMessageBodyProps = {
  className?: string;
  content: string;
  sx?: object;
  attachments?: Array<Attachment>;
};

const ChatMessageBody = ({
  className,
  content,
  sx,
  attachments = [],
}: ChatMessageBodyProps) => {
  const parsedSx = Object.assign(
    {
      px: '14px',
      py: 2,
      borderRadius: 4,
      maxWidth: '80%',
      p: {mb: 0},
      ul: {my: 2},
      ol: {my: 2},
      blockquote: {
        px: 2,
        borderLeft: '3px solid',
        mb: 0,
      },
    },
    sx
  );

  return (
    <Box sx={parsedSx}>
      <ReactMarkdown
        className={`Text--markdown ${className || ''}`}
        components={renderers}
        remarkPlugins={[breaks]}
      >
        {content}
      </ReactMarkdown>
      {attachments && attachments.length > 0 && (
        <Box mt={2} className={`Text--markdown ${className || ''}`}>
          {attachments.map((attachment) => {
            return (
              <ChatMessageAttachment
                key={attachment.id}
                attachment={attachment}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ChatMessageBody;
