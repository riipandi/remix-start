import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  return json({
    message: "Hello, world!",
    request,
  });
}

export async function action({ request }: ActionArgs) {}
