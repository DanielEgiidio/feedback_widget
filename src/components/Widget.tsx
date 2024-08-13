import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import tailwindStyles from "../index.css?inline";

export default function Widget() {
  const [rating, setRating] = useState<number>(3);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onSelectedStar = (index: number) => {
    setRating(index + 1);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      feedback: formData.get("feedback") as string,
      rating, // Incluindo o rating nos dados
    };
    setSubmitted(true);
    console.log(data); // Verifica se os dados estão corretos
  };

  return (
    <>
      <style>{tailwindStyles}</style>
      <div className="widget fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full shadow-lg hover:scale-105 p-6">
              <MessageCircleIcon className="mr-2 h-5 w-5" />
              Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent className="widget rounded-lg bg-card p-4 shadow-lg w-full max-w-md">
            <style>{tailwindStyles}</style>
            {submitted ? (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">
                  Obrigado pelo seu feedback!
                </h3>
                <p>
                  Nós apreciamos o seu feedback, nos ajudará a melhorar nosso
                  produto e entregar um melhor serviço para os nossos clientes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <strong className="text-xl font-bold">
                  Nos envie o seu feedback
                </strong>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Insira o seu nome"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Insira o seu e-mail"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      className="min-h-[100px]"
                      id="feedback"
                      name="feedback"
                      placeholder="Informe o seu feedback"
                      required
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-6 w-6 cursor-pointer ${
                              rating > index
                                ? "fill-yellow-500 stroke-none"
                                : "text-gray-300 stroke-muted-foreground"
                            }`}
                            onClick={() => onSelectedStar(index)}
                          />
                        ))}
                      </div>
                      <Button type="submit">Enviar</Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="lucide lucide-star"
      {...props}
    >
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      className="mr-2 h-5 w-5"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
