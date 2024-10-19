class VariableTool {
    static get isInline() {
        return true;
    }

    constructor({ api }) {
        this.api = api;
    }

    render() {
        return document.createElement('div');
    }

    surround(range) {
        // Not needed
    }

    checkState() {
        // Not needed
        return false;
    }

    static get sanitize() {
        return {
            span: {
                class: 'cdx-variable'
            }
        };
    }

    insertVariable(variableValue) {
        const index = this.api.selection.findParentTag('P').index;
        const block = this.api.blocks.getBlockByIndex(index);
        
        if (block) {
            const currentText = block.holder.textContent;
            const updatedText = currentText + ' ' + variableValue;
            
            this.api.blocks.update(index, { text: updatedText });
            
            // Create a styled span for the variable
            const variableSpan = document.createElement('span');
            variableSpan.classList.add('cdx-variable');
            variableSpan.textContent = variableValue;
            variableSpan.style.backgroundColor = '#e0f7fa';
            variableSpan.style.padding = '2px 4px';
            variableSpan.style.borderRadius = '2px';
            
            // Replace the plain text variable with the styled span
            const range = new Range();
            const textNode = block.holder.lastChild;
            range.setStart(textNode, textNode.length - variableValue.length);
            range.setEnd(textNode, textNode.length);
            range.deleteContents();
            range.insertNode(variableSpan);
        }
    }
}

export default VariableTool;
