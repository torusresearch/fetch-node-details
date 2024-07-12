import { KEY_TYPE, TORUS_LEGACY_NETWORK, TORUS_NETWORK_TYPE, TORUS_SAPPHIRE_NETWORK, WEB3AUTH_KEY_TYPE } from "@toruslabs/constants";
import { fetchLocalConfig } from "@toruslabs/fnd-base";
import { celebrate, Joi } from "celebrate";
import express, { Request, Response } from "express";
import log from "loglevel";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  return res.status(200).send("Welcome to the fnd server!!");
});

router.get("/health", (_req: Request, res: Response) => {
  return res.status(200).send("ok!");
});

router.get(
  "/node-details",
  celebrate(
    {
      query: Joi.object({
        network: Joi.string()
          .required()
          .allow(...Object.values(TORUS_LEGACY_NETWORK), ...Object.values(TORUS_SAPPHIRE_NETWORK)),
        verifier: Joi.string().required(),
        verifierId: Joi.string().required(),
        keyType: Joi.string()
          .optional()
          .allow(...Object.values(KEY_TYPE)),
      }),
    },
    { allowUnknown: true }
  ),
  async (req: Request, res: Response) => {
    try {
      const { network, keyType = "secp256k1" } = req.query as Record<string, string>;
      const finalNetwork = network.toLowerCase();
      // use static details for sapphire mainnet and testnet
      const nodeDetails = fetchLocalConfig(finalNetwork as TORUS_NETWORK_TYPE, keyType as WEB3AUTH_KEY_TYPE);

      return res.status(200).json({
        nodeDetails,
        success: true,
      });
    } catch (error) {
      log.error("Error while fetching nodes details", error);
      return res.status(500).json({
        success: false,
        message: (error as Error).message || "Something went wrong",
      });
    }
  }
);

export default router;
