import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import tailwindStyles from "../index.css?inline";
import supabase from "../supabaseClient";
import { Checkbox } from "@/components/ui/checkbox";

const bannedWords = ["spam", "advertisement", "compre", "https://"];

const schema = z.object({
  name: z
    .string()
    .min(4, "Nome deve ter pelo menos 4 letras")
    .max(25, "Nome deve ter no máximo 50 letras")
    .regex(/^[a-zA-Z\s]+$/, "Nome deve conter apenas letras e espaços"),

  email: z
    .string()
    .email("Email inválido")
    .max(25, "Email deve ter no máximo 100 caracteres"),

  feedback: z
    .string()
    .max(255, "Descrição deve ter no máximo 255 caracteres")
    .optional()
    .refine(
      (value) =>
        bannedWords.every((word) => !value?.toLowerCase().includes(word)),
      "Descrição contém palavras não permitidas"
    ),

  terms: z
    .boolean()
    .refine((value) => value === true, "Você deve aceitar os termos"),
});

export const Widget = ({ projectId }) => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [captchaValidated, setCaptchaValidated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const feedbackLength = watch("feedback")?.length || 0;

  const onCaptchaChange = () => {
    setCaptchaValidated(true);
  };

  console.log("Form Validity:", isValid);
  console.log("Form Errors:", errors);

  const onSelectStar = (index) => {
    setRating(index + 1);
  };
  const submit = async (data) => {
    if (!captchaValidated) {
      alert("Por favor, complete o reCAPTCHA.");
      return;
    }

    try {
      const feedbackData = {
        p_project_id: projectId,
        p_user_name: data.name,
        p_user_email: data.email,
        p_message: data.feedback,
        p_rating: rating,
      };

      const { data: returnedData, error } = await supabase.rpc(
        "add_feedback",
        feedbackData
      );

      if (error) {
        console.error("Error submitting feedback:", error.message);
        alert("Erro ao enviar o feedback. Por favor, tente novamente.");
        return;
      }

      setSubmitted(true);
      console.log(returnedData);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Ocorreu um erro inesperado. Por favor, tente novamente.");
    }
  };

  return (
    <>
      <style>{tailwindStyles}</style>
      <div className="widget fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full p-7 bg-[#4a3aff] shadow-lg hover:scale-105 hover:bg-[#14142B] transition-all ease duration-200">
              <ChatIcon className="mr-2 h-7 w-7" />
              <span className="antialiased text-neutral-100 text-base text-pretty tracking-[1.5px]">
                Feedback
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="widget rounded-lg bg-card p-4 shadow-lg w-full lg:max-w-md max-w-sm">
            <style>{tailwindStyles}</style>
            {submitted ? (
              <div>
                <h3 className="text-lg font-bold">
                  Obrigado pelo seu feedback!
                </h3>
                <p className="mt-4">
                  Agradecemos o seu feedback. Nos ajudará a melhorar nossos
                  produtos e serviços para nossos clientes.
                </p>
              </div>
            ) : (
              <div className="">
                <h3 className="lg:text-2xl text-xl font-bold text-pretty tracking-[1px] pb-8 text-center antialiased">
                  Preencha o formulário para enviar seu feedback
                </h3>
                <form className="space-y-2" onSubmit={handleSubmit(submit)}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="lg:text-base text-sm" htmlFor="name">
                        Nome
                      </Label>
                      <div className="relative mt-1 focus-within:text-[#4a3aff]">
                        <Input
                          className="w-full rounded-full p-7 overflow-hidden text-ellipsis"
                          id="name"
                          placeholder="Insira seu nome"
                          {...register("name")}
                        />
                        <div className="absolute inset-y-0 right-0 mb-4 flex items-center pr-3 pointer-events-none">
                          <NameIcon className="h-5 w-5 text-pretty" />
                        </div>
                        <div className="min-h-[1rem]">
                          {errors.name && (
                            <p className="text-xs text-red-500 ">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="lg:text-base text-sm" htmlFor="name">
                        Email
                      </Label>
                      <div className="relative mt-1 focus-within:text-[#4a3aff]">
                        <Input
                          className="w-full rounded-full p-7 overflow-hidden text-ellipsis"
                          id="email"
                          placeholder="Insira seu email"
                          {...register("email")}
                        />
                        <div className="absolute inset-y-0 right-0 mb-4 flex items-center pr-1.5 pointer-events-none">
                          <EmailIcon className="h-5 w-6 text-pretty" />
                        </div>
                        <div className="min-h-[1rem]">
                          {errors.email && (
                            <p className="text-xs text-red-500 ml-2">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 mt-3">
                      <Label className="lg:text-base text-sm">
                        Classifique sua experiência
                      </Label>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, index) => (
                            <StarIcon
                              key={index}
                              className={`lg:h-7 lg:w-7 w-5 h-5 cursor-pointer stroke-none ${
                                rating > index ? "fill-[#FFD029]" : "fill-muted"
                              }`}
                              onClick={() => onSelectStar(index)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 py-2">
                    <Label htmlFor="feedback" className="lg:text-base text-sm">
                      Feedback
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder="Caso você tenha um feedback adicional, por favor, escreva aqui..."
                      className="p-3 text-sm lg:min-h-[150px] min-h-[100px] w-full overflow-hidden text-ellipsis"
                      {...register("feedback")}
                    />
                    <p className="text-sm text-pretty">
                      {feedbackLength}/255 caracteres
                    </p>
                    {errors.feedback && (
                      <p className="text-red-500 text-sm">
                        {errors.feedback.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 focus-within:text-[#4a3aff]">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="lg:text-base text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 active:text-[#4a3aff]"
                    >
                      Aceito os termos e condições
                    </label>
                    {errors.terms && (
                      <p className="text-red-500 text-sm">
                        {errors.terms.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 py-2">
                    <Button
                      className="tracking-[1px] text-base p-6 rounded-full bg-[#4a3aff] hover:bg-[#14142B] transition-all ease duration-200"
                      type="submit"
                    >
                      <span className="text-pretty text-neutral-100">
                        Enviar Feedback
                      </span>
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ChatIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke="none"
        d="M16 14h.5c.827 0 1.5-.673 1.5-1.5v-9c0-.827-.673-1.5-1.5-1.5h-13C2.673 2 2 2.673 2 3.5V18l5.333-4H16zm-9.333-2L4 14V4h12v8H6.667z"
      />
      <path
        stroke="none"
        d="M20.5 8H20v6.001c0 1.1-.893 1.993-1.99 1.999H8v.5c0 .827.673 1.5 1.5 1.5h7.167L22 22V9.5c0-.827-.673-1.5-1.5-1.5z"
      />
    </svg>
  );
}

function NameIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      className={props.className}
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx={12} cy={7} r={4} />
    </svg>
  );
}

function EmailIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      className={props.className}
      {...props}
    >
      <rect width={20} height={16} x={2} y={4} rx={2} />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
