'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import { api } from '../../../../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const successUpdate = () => toast.success('Changes saved');

const TemplateDetail = ({ params }) => {
  const { id } = params;
  const [template, setTemplate] = useState(null);
  const [name, setName] = useState('');
  const [editorInstance, setEditorInstance] = useState(null);
  const editorRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplate = async () => {
      const response = await api.getTemplateById(`${id}`);
      setTemplate(response.data);
      setName(response.data.name);
    };
    fetchTemplate();
  }, [id]);

  useEffect(() => {
    if (template && !editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        data: template.content,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a heading',
              levels: [2, 3, 4],
            },
          },
        },
        onReady: () => {
          editorRef.current = editor;
          setEditorInstance(editor);
        },
      });

      return () => {
        editorRef.current?.destroy();
        editorRef.current = null;
      };
    }
  }, [template]);

  const handleDelete = async () => {
    //untuk delete template
    await api.deleteTemplate(template.id);
    router.push('/templates/index');
  };
  // save template
  const handleSave = async () => {
    if (!editorInstance) return;

    try {
      const content = await editorInstance.save();
      await api.updateTemplate(template.id, { name, content });
      successUpdate();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  if (!template) return <div>Loading...</div>;

  return (
    <div className="">
      <Toaster />
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex flex-col space-y-4">
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
        <button type="button" onClick={handleDelete}>Delete Template</button>
        <button type="submit" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Changes</button>
      </form>
    </div>
  );
};

export default TemplateDetail;
