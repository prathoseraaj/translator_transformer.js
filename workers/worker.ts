import { pipeline } from "@huggingface/transformers";

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

})