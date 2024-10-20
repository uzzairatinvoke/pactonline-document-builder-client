'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../utils/api';
import EditorJS from '@editorjs/editorjs';
import toast, { Toaster } from 'react-hot-toast';
import DragDrop from "editorjs-drag-drop";
import Underline from '@editorjs/underline';
import Table from '@editorjs/table'
import Undo from 'editorjs-undo';
import Title from "title-editorjs";
import List from '@editorjs/list';


const successCreate = () => toast.success('Template saved!');

const NewTemplate = ({ existingTemplate }) => {
    const [name, setName] = useState(existingTemplate?.name || '');
    const [editorInstance, setEditorInstance] = useState(null);
    const [content, setContent] = useState(existingTemplate?.content ? JSON.parse(existingTemplate.content) : {});
    const router = useRouter();
    const editorRef = useRef(null);

    const variables = [
        { name: 'Full Name', value: '{{full_name}}' },
        { name: 'SSN', value: '{{ssn}}' },
        { name: 'Date of Birth', value: '{{date_of_birth}}' },
    ];

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedVariable, setSelectedVariable] = useState('Choose Placeholder');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const Paragraph = require('editorjs-paragraph-with-alignment');
        if (typeof window !== 'undefined' && !editorRef.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                tools: {
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    title: {
                        class: Title,
                        inlineToolbar: true
                    },
                    table: Table,
                    underline: {
                        class: Underline,
                        inlineToolbar: true,
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                        config: {
                            defaultStyle: 'unordered'
                        }
                    },
                },
                data: content,
                onReady: () => {

                    editorRef.current = editor;
                    new DragDrop(editor);
                    new Undo({ editor });
                    setEditorInstance(editor);
                },
            });
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleVariableClick = (variableValue) => {
        if (editorInstance) {
            editorInstance.save().then((outputData) => {
                const blocks = outputData.blocks;

                if (blocks.length === 0) {
                    editorInstance.blocks.append('paragraph', { text: variableValue });
                } else {
                    const lastBlock = blocks[blocks.length - 1];

                    if (lastBlock && (lastBlock.type === 'paragraph' || lastBlock.type === 'header')) {
                        lastBlock.data.text += ' ' + variableValue;
                        editorInstance.render({ blocks: outputData.blocks });
                    } else {
                        editorInstance.blocks.append('paragraph', { text: variableValue });
                    }
                }
            }).catch((error) => {
                console.error('Error saving editor content:', error);
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
                        <div className="relative " ref={dropdownRef}>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Document Placeholder</h3>
                            <p className="text-sm font-normal">Enter placeholders in the document template such as customer's Full Name, NRIC, etc via this dropdown.</p>
                            <div className="relative w-56">

                                <select
                                    value={selectedVariable}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        setSelectedVariable('Choose Placeholder');
                                        handleVariableClick(selectedValue);
                                    }}
                                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 rounded focus:outline-none bg-white shadow-sm border-gray-200"
                                >
                                    <option value="Choose Placeholder" disabled>Choose Placeholder</option>
                                    {variables.map((variable, index) => (
                                        <option key={index} value={variable.value}>
                                            {variable.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div id="editorjs" className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm bg-white"></div>

                        <button type="submit" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Template</button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default NewTemplate;
