import Image from "next/image";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { nodes } from "@/db/schema";
import DeployDialog from "./deploy-dialog";

export type Node = typeof nodes.$inferSelect;

export default function NodePadCard({
  node,
  purchased,
  className,
  onClick,
}: {
  node: Node;
  purchased?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={cn(
        "relative w-11/12 cursor-default border-2 bg-foreground/5 duration-200 hover:border-primary/20 hover:bg-primary/5",
        className,
      )}
      onClick={onClick}
    >
      {!purchased && node.slots > 0 && (
        <div className="absolute right-4 top-4 self-end">
          <div className="absolute -left-2 -top-2 h-7 w-7 animate-pulse rounded-full bg-primary/50 blur-lg"></div>
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary"></div>
        </div>
      )}
      <CardHeader className="flex items-center">
        <Image src={node.logo} alt="Image" width={80} height={80} className="w-1/2" />
      </CardHeader>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Image src={node.logo} alt="Image" width={80} height={80} />
          <div className="space-y-2">
            <CardTitle>{node.name}</CardTitle>
            <CardDescription>{node.type}</CardDescription>
          </div>
        </div>
        <Button
          variant={"ghost"}
          className="rounded-md border border-primary/40 px-8 py-5 hover:bg-primary-foreground text-md font-semibold"
        >
          Buy
        </Button>
        {/* <DeployDialog node={node}>
          <Button
            variant={"ghost"}
            className="rounded-md border border-primary/40 px-8 py-5 hover:bg-primary-foreground text-md font-semibold"
          >
            {node.slots <= 0 ? "View Plans" : "BUY"}
          </Button>
        </DeployDialog> */}
      </CardHeader>
      <CardFooter className="m-3 flex-row items-center justify-between rounded-md bg-primary/5 p-4 ">
        <div className="flex flex-row items-center gap-2">
          <span className="font-semibold text-primary text-xl">
            {/* {node.slots <= 0 ? "Sold Out" : "Slots"} */}
            100%
          </span>
          <span className="font-semibold text-primary text-md pt-1">
            Nodes Sold
          </span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <strong className="text-xl font-semibold">
            {/* {node.slots <= 0 ? "" : node.slots} */}
            $324,565
          </strong>
          <strong className="text-md font-semibold pt-1">
            Total Sales
          </strong>
        </div>
      </CardFooter>
    </Card>
  );
}
