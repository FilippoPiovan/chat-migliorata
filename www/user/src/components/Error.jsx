import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
const port = 3000;

export default function App() {
  return (
    <div className="max-w-full min-h-screen">
      <Card className="max-w-[400px] max-h-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">Me SAGE</p>
            <p className="text-small text-default-500">Messaggi ∞ gratis</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            Stai provando ad accedere al server usando l&apos;URL sbagliato.
          </p>
        </CardBody>
        <Divider />
        <CardFooter>
          <p>Utilizza http://localhost:{port}/?id=[valore]</p>
        </CardFooter>
      </Card>
    </div>
  );
}
