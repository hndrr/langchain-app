import { initLlama, loadLlamaModelInfo } from 'llama.rn';
import "web-streams-polyfill/dist/polyfill.min.js";

const modelPath = process.env.EXPO_PUBLIC_LLAMA_MODEL_PATH!;
let context: any;

// Initialize Llama context
const initializeLlama = async () => {
  try {
    const modelInfo = await loadLlamaModelInfo(modelPath);
    context = await initLlama({
      model: modelPath,
      use_mlock: true,
      n_ctx: 2048,
      n_gpu_layers: 1, // Enable GPU layers
    });
    console.log('Llama initialized successfully');
  } catch (error) {
    console.error('Error initializing Llama:', error);
  }
};

// Call initialization on module load
initializeLlama();

const stopWords = [
  '</s>',
  '<|end|>',
  '<|eot_id|>',
  '<|end_of_text|>',
  '<|im_end|>',
  '<|EOT|>',
  '<|END_OF_TURN_TOKEN|>',
  '<|end_of_turn|>',
  '<|endoftext|>',
];

export const postChatMessage = async (text: string): Promise<string> => {
  if (!context) {
    throw new Error('Llama context is not initialized');
  }

  try {
    const msgResult = await context.completion(
      {
        messages: [
          {
            role: 'system',
            content: 'This is a conversation between user and AI assistant.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        n_predict: 100,
        stop: stopWords,
      },
      (data: { token: any; }) => {
        // Optionally handle partial completions here
        const { token } = data;
        console.log('Partial token:', token);
      }
    );

    // メッセージから  '<end_of_turn>','<eos>'　を削除
    const response = msgResult?.text
      .replace('<end_of_turn>', '')
      .replace('<eos>', '')
      .trim();

    return response || 'No response';
  } catch (error) {
    console.error('Error in postChatMessage:', error);
    throw error;
  }
};
