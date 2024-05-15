import { FC, PropsWithChildren } from 'react'

declare global {
  // @see https://github.com/AlexGilleran/jsx-control-statements/issues/72#issuecomment-389484553
  const If: FC<PropsWithChildren<{ condition: boolean }>>
  const Choose: FC<PropsWithChildren>
  const When: FC<PropsWithChildren<{ condition: boolean }>>
  const Otherwise: FC<PropsWithChildren>
  // Don't support <With> / <For>, because they are hard to type properly,
  // and only complicate code readability anyway.
}
