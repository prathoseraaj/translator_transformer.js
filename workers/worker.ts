import { pipeline, TextStreamer } from "@huggingface/transformers";

class TranslationPipeline {
    static task = "translation";
    static model = "Xenova/nllb-200-distilled-600";
    static instance: any = null;

    static getInstance = async (progress_callback: any = null) => {
        this.instance ??= pipeline(this.task, this.model, {
            progress_callback,
        });

        return this.instance;
    }
}

self.addEventListener("message", async (event: MessageEvent) => {
        const {text, src_lang, tgt_lang} = event.data;

        const translator = await TranslationPipeline.getInstance(
            (progress: any) => {
                self.postMessage(progress);
            }
        );

        const streamer = new TextStreamer(translator.tokenizer,{
            skip_prompt: true,
            skip_special_tokens: true,

            callback_function: (text:string) =>{
                self.postMessage({
                    status: "update",
                    output: text,
                });
            },
        });

        const output = await translator(text,{
            tgt_lang,
            src_lang,
            streamer,
        });

        self.postMessage({
            status: "complete",
            output,
        });
});