export const quillModules = {
    toolbar: [
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link'], // Only links allowed, no images or videos
        ['clean'], // remove formatting button
    ],
};

export const quillFormats = [
    'font', 'size',
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'script', 'indent', 'direction',
    'align',
    'blockquote', 'code-block',
    'link',
];
