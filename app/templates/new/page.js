'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../utils/api';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import VariableTool from '../../components/VariableTool';
import toast, { Toaster } from 'react-hot-toast';
import DragDrop from "editorjs-drag-drop";
import Underline from '@editorjs/underline';

const successCreate = () => toast.success('Template saved!');

const NewTemplate = ({ existingTemplate }) => {
    const [name, setName] = useState(existingTemplate?.name || '');
    const [editorInstance, setEditorInstance] = useState(null);
    const [content, setContent] = useState(existingTemplate?.content ? JSON.parse(existingTemplate.content) : {});
    const router = useRouter();
    const editorRef = useRef(null);

    const variables = [
        {name: 'Full Name', value: '{{full_name}}'},
        {name: 'SSN', value: '{{ssn}}'},
        {name: 'Date of Birth', value: '{{date_of_birth}}'},
    ];

    useEffect(() => {
        if (typeof window !== 'undefined' && !editorRef.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                tools: {
                    underline: {
                        class: Underline,
                        inlineToolbar: true,
                    },
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Enter a heading',
                            levels: [1, 2, 3, 4, 5, 6],
                        },
                    },
                    variable: {
                        class: VariableTool,
                        inlineToolbar: true,
                    },
                },
                data: content,
                onReady: () => {
                    
                    editorRef.current = editor;
                    new DragDrop(editor);
                    setEditorInstance(editor);
                },
            });
        }
    }, []);

    const handleVariableClick = (variableValue) => {
        if (editorInstance) {
            editorInstance.save().then((outputData) => {
                const blocks = outputData.blocks;
                const lastBlock = blocks[blocks.length - 1];
                
                if (lastBlock && lastBlock.type === 'paragraph') {
                    // Append to the last paragraph
                    lastBlock.data.text += ' ' + variableValue;
                    editorInstance.render({ blocks: outputData.blocks });
                } else {
                    // Create a new paragraph with the variable
                    editorInstance.blocks.append('paragraph', { text: variableValue });
                }
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editorInstance) return;

        try {
            const content = await editorInstance.save();
            console.log('Raw content to save:', content);
            await api.createTemplate({ name, content });
            router.push('/');
            successCreate();
        } catch (error) {
            console.error('Error saving template:', error);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
                <div className="flex-grow">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm bg-white">
                            <label htmlFor="name" className="block text-xs font-medium text-gray-900">Template Title</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter the title for this template"
                                required
                                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div id="editorjs" className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm bg-white"></div>

                        <button type="submit" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Template</button>
                    </form>
                </div>
                <div className="w-48 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm bg-white">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Variables</h3>
                    {variables.map((variable, index) => (
                        <button
                            key={index}
                            onClick={() => handleVariableClick(variable.value)}
                            className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                            {variable.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewTemplate;
