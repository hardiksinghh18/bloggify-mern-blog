export const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link'], // Only links allowed, no images or videos
        ['clean'], // remove formatting button
    ],
};

export const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'script', 'indent',
    'align',
    'blockquote', 'code-block',
    'link',
];
