"use client"

import { Button } from "@/components/ui/button"
import { Coins, ShoppingCart, Tag, LogIn, ImageOff, Loader2, ExternalLink } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RarityBadge } from "@/components/rarity-badge"
import { PartnerLogo } from "@/components/partner-logo"
import { NFTDetailModal } from "@/components/nft-detail-modal"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "lucide-react"

interface NFTCardProps {
  nft: any
  price: number
  onBuy?: () => Promise<void>
  disableBuy?: boolean
  isProcessing?: boolean
  isAuthenticated?: boolean
  showSellOption?: boolean
  onSell?: () => void
  isSelling?: boolean
  userBalance?: number
  isOwner?: boolean
  bids?: Array<{
    id: string
    bidder_id: string
    bidder_name: string
    amount: number
    created_at: string
  }>
  onBid?: (bidAmount: number) => Promise<void>
}

export function NFTCard({
  nft,
  price,
  onBuy,
  disableBuy = false,
  isProcessing = false,
  isAuthenticated = false,
  showSellOption = false,
  onSell,
  isSelling = false,
  userBalance = 0,
  isOwner = false,
  bids = [],
  onBid,
}: NFTCardProps) {
  const [imageError, setImageError] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const hasExpiration = nft.expiration_date && new Date(nft.expiration_date) > new Date()
  const isPartnerNFT = !!nft.partner_company

  // Função para gerar uma imagem de fallback baseada no nome do NFT
  const generateFallbackImage = () => {
    const colors = [
      "from-purple-500 to-blue-500",
      "from-blue-500 to-teal-500",
      "from-teal-500 to-green-500",
      "from-green-500 to-yellow-500",
      "from-yellow-500 to-orange-500",
      "from-orange-500 to-red-500",
      "from-red-500 to-pink-500",
      "from-pink-500 to-purple-500",
    ]

    // Usar o nome do NFT para selecionar uma cor consistente
    const colorIndex = nft.name ? nft.name.length % colors.length : 0
    const gradientClass = colors[colorIndex]

    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradientClass}`}>
        <div className="text-white text-center p-4">
          <ImageOff className="h-12 w-12 mx-auto mb-2" />
          <p className="font-bold text-lg">{nft.name || "NFT"}</p>
          {nft.partner_company && <p className="text-sm">{nft.partner_company}</p>}
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div
          className="aspect-square relative bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-950/50 dark:to-teal-950/50 overflow-hidden cursor-pointer"
          onClick={() => setDetailModalOpen(true)}
        >
          {imageError ? (
            generateFallbackImage()
          ) : (
            <img
              src={nft.image_url || "/placeholder.svg?height=400&width=400"}
              alt={nft.name || "NFT"}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute top-2 right-2">
            <RarityBadge rarity={nft.rarity || "common"} />
          </div>
          {isPartnerNFT && (
            <div className="absolute top-2 left-2">
              <PartnerLogo partner={nft.partner_company} />
            </div>
          )}
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{nft.name}</CardTitle>
          <CardDescription className="line-clamp-2">{nft.description}</CardDescription>
        </CardHeader>
        {isPartnerNFT && nft.benefit_description && (
          <CardContent className="px-4 pb-0">
            <div className="bg-muted p-2 rounded-md text-sm">
              <p className="font-medium mb-1">Benefício:</p>
              <p className="text-muted-foreground line-clamp-2">{nft.benefit_description}</p>
              {hasExpiration && (
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    Expira em{" "}
                    {formatDistanceToNow(new Date(nft.expiration_date), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        )}
        <CardFooter className="p-4 pt-4 flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
          <div className="flex items-center">
            <Coins className="h-4 w-4 text-purple-600 mr-1" />
            <span className="font-bold">{price} LOYA</span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            <Button size="sm" variant="outline" onClick={() => setDetailModalOpen(true)} className="w-full sm:w-auto">
              <ExternalLink className="h-4 w-4 mr-1" />
              Detalhes
            </Button>

            {onBuy && !isAuthenticated ? (
              <Link href="/?login=true" className="w-full sm:w-auto">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Entrar
                </Button>
              </Link>
            ) : onBuy ? (
              <Button
                size="sm"
                onClick={onBuy}
                disabled={disableBuy || isProcessing}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Comprar
                  </>
                )}
              </Button>
            ) : null}
            {showSellOption && (
              <Button
                size="sm"
                variant={isSelling ? "destructive" : "outline"}
                onClick={onSell}
                disabled={isSelling}
                className="w-full sm:w-auto"
              >
                <Tag className="h-4 w-4 mr-1" />
                {isSelling ? "À venda" : "Vender"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <NFTDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        nft={nft}
        price={price}
        isOwner={isOwner}
        isAuthenticated={isAuthenticated}
        userBalance={userBalance}
        onBuy={onBuy}
        onBid={onBid}
        onSell={onSell}
        isSelling={isSelling}
        isProcessing={isProcessing}
        bids={bids}
      />
    </>
  )
}
