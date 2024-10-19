import { NextResponse } from 'next/server';

let templates = []; // In-memory storage for simplicity

export async function GET() {
  return NextResponse.json(templates);
}

export async function POST(request) {
  const { name, content } = await request.json();
  const newTemplate = { id: templates.length + 1, name, content };
  templates.push(newTemplate);
  return NextResponse.json(newTemplate, { status: 201 });
}

export async function PUT(request) {
  const { id, name, content } = await request.json();
  const index = templates.findIndex(template => template.id === id);
  if (index > -1) {
    templates[index] = { id, name, content };
    return NextResponse.json(templates[index]);
  }
  return NextResponse.json({ message: 'Template not found' }, { status: 404 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const index = templates.findIndex(template => template.id === id);
  if (index > -1) {
    templates.splice(index, 1);
    return NextResponse.json({ message: 'Template deleted' });
  }
  return NextResponse.json({ message: 'Template not found' }, { status: 404 });
}
