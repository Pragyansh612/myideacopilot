export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="glass-strong rounded-2xl p-8 md:p-12 text-center space-y-8">
          <div className="w-24 h-24 mx-auto glass rounded-full animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-6 bg-muted/30 rounded-lg animate-pulse max-w-md mx-auto" />
            <div className="h-4 bg-muted/20 rounded-lg animate-pulse max-w-lg mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
