import NODE from '../lib/NODE';

export default class TAG extends NODE {
    tagName: String = "";
    parse() {
        this.tagName = this.tokenizer.getNext();
    }

    evaluate() {
        // stub
        throw new Error('Not implemented');
    }
}
